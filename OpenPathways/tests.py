from django.test import TestCase
from OpenPathways.models import *
from django.core.exceptions import ValidationError


class BadgeRelationTestCase(TestCase):

    def test_get_parents(self):
        badge = Badge.objects.create(name='badge')
        child1 = Badge.objects.create(name='child1')
        BadgeRelation.objects.create(fromBadge=badge,
                                     toBadge=child1,
                                     optional=False)
        grandchild1 = Badge.objects.create(name='grandchild1')
        BadgeRelation.objects.create(fromBadge=child1,
                                     toBadge=grandchild1,
                                     optional=False)
        parents = child1.get_parents()

        self.assertQuerysetEqual(parents, Badge.objects.filter(name='badge'), ordered=False)

        parents = grandchild1.get_parents()
        self.assertQuerysetEqual(parents, Badge.objects.filter(name='child1'), ordered=False)

        badge2 = Badge.objects.create(name='badge2')
        BadgeRelation.objects.create(fromBadge=badge2,
                                     toBadge=child1,
                                     optional=False)
        parents = child1.get_parents()

        self.assertQuerysetEqual(parents, Badge.objects.filter(name__in=['badge', 'badge2']), ordered=False)

    def test_get_children(self):
        badge = Badge.objects.create(name='badge')
        child1 = Badge.objects.create(name='child1')
        BadgeRelation.objects.create(fromBadge=badge,
                                     toBadge=child1,
                                     optional=False)
        grandchild1 = Badge.objects.create(name='grandchild1')
        BadgeRelation.objects.create(fromBadge=child1,
                                     toBadge=grandchild1,
                                     optional=False)
        children = badge.get_children()

        self.assertQuerysetEqual(children, Badge.objects.filter(name='child1'), ordered=False)

        children = child1.get_children()
        self.assertQuerysetEqual(children, Badge.objects.filter(name='grandchild1'), ordered=False)

        child2 = Badge.objects.create(name='child2')
        BadgeRelation.objects.create(fromBadge=badge,
                                     toBadge=child2,
                                     optional=False)
        children = badge.get_children()

        self.assertQuerysetEqual(children, Badge.objects.filter(name__in=['child1', 'child2']), ordered=False)

    def test_check_optional_relations_rquired(self):
        badge = Badge.objects.create(name='badge')
        child1 = Badge.objects.create(name='child1')
        BadgeRelation.objects.create(fromBadge=badge,
                                     toBadge=child1,
                                     optional=False)

        with self.assertRaises(ValidationError) as error:
            BadgeRelation.objects.create(fromBadge=badge,
                                         toBadge=child1,
                                         optional=True),
        self.assertEqual(error.exception.message, "Optional relations must have an optional relationship group set")

    def test_full_optional(self):

        ## Make a completley optional badge
        # opt1 is optional to lead to b1 - you don't have to have done opt1 to get b1

        opt1 = Badge.objects.create(name='opt1')
        b1 = Badge.objects.create(name='b1')

        optRel = OptionalRelation.objects.create(name='Option1',
                                                 badge=b1,
                                                 minimum_required=0
                                                )
        rel = BadgeRelation.objects.create(fromBadge=opt1,
                                           toBadge=b1,
                                           optional=True,
                                           optional_group=optRel)

        # B1 should be opt1's child:
        self.assertQuerysetEqual(opt1.get_children(),
                                 Badge.objects.filter(name='b1'),
                                 ordered=False)

    def test_mix_optional(self):

        ## Make a choice of two badges
        # You need either b1 or b2 to get opt1

        opt1 = Badge.objects.create(name='opt1')
        b1 = Badge.objects.create(name='b1')
        opt2 = Badge.objects.create(name='opt2')

        optRel = OptionalRelation.objects.create(name='Option1',
                                                 badge=b1,
                                                 minimum_required=1
                                                 )
        rel1 = BadgeRelation.objects.create(fromBadge=opt1,
                                           toBadge=b1,
                                           optional=True,
                                           optional_group=optRel)
        rel2 = BadgeRelation.objects.create(fromBadge=opt2,
                                            toBadge=b1,
                                            optional=True,
                                            optional_group=optRel)

        # B1 should be opt1's child:
        self.assertQuerysetEqual(opt1.get_children(),
                                 Badge.objects.filter(name__in=['b1', 'b2']),
                                 ordered=False)

    def test_optional_children(self):
        ## You MUST have req1, and ONE of opt1 or opt2

        opt1 = Badge.objects.create(name='opt1')
        b1 = Badge.objects.create(name='b1')
        opt2 = Badge.objects.create(name='opt2')
        req1 = Badge.objects.create(name='req1')

        optRel = OptionalRelation.objects.create(name='Option1',
                                                 badge=b1,
                                                 minimum_required=1
                                                 )
        rel1 = BadgeRelation.objects.create(fromBadge=opt1,
                                            toBadge=b1,
                                            optional=True,
                                            optional_group=optRel)
        rel2 = BadgeRelation.objects.create(fromBadge=opt2,
                                            toBadge=b1,
                                            optional=True,
                                            optional_group=optRel)

        BadgeRelation.objects.create(toBadge=b1,
                                     fromBadge=req1,
                                     optional=False)
        self.assertQuerysetEqual(b1.get_parents(),
                                 Badge.objects.filter(name__in=['opt1', 'opt2', 'req1']),
                                 ordered=False)

        self.assertQuerysetEqual(b1.get_parents(include_optional=False),
                                 Badge.objects.filter(name='req1'))

        self.assertQuerysetEqual(opt1.get_children(),
                                 Badge.objects.filter(name='b1'))

        self.assertQuerysetEqual(opt1.get_children(include_optional=False),
                                 Badge.objects.none())
        self.assertQuerysetEqual(opt2.get_children(),
                                 Badge.objects.filter(name='b1'))

        self.assertQuerysetEqual(opt2.get_children(include_optional=False),
                                 Badge.objects.none())

        self.assertQuerysetEqual(req1.get_children(),
                                 Badge.objects.filter(name='b1'))

        self.assertQuerysetEqual(req1.get_children(include_optional=False),
                                 Badge.objects.filter(name='b1'))

    def test_can_award_badge(self):

        target = Badge.objects.create(name='target')
        req1 = Badge.objects.create(name='req1')
        req2 = Badge.objects.create(name='req2')
        opt1 = Badge.objects.create(name='opt1')
        opt2 = Badge.objects.create(name='opt2')

        BadgeRelation.objects.create(fromBadge=req1,
                                     toBadge=target)
        BadgeRelation.objects.create(fromBadge=req2,
                                     toBadge=target)

        g1 = OptionalRelation.objects.create(name='opt1 or 2 to target 1',
                                             badge=target,
                                             minimum_required=1)
        BadgeRelation.objects.create(fromBadge=opt1,
                                     toBadge=target,
                                     optional=True,
                                     optional_group=g1)
        BadgeRelation.objects.create(fromBadge=opt2,
                                     toBadge=target,
                                     optional=True,
                                     optional_group=g1)

        # Try for someone who meets all requirements:
        owned_badges = Badge.objects.filter(name__in=['req1',
                                                      'req2',
                                                      'opt1',
                                                      'opt2'])
        self.assertEqual(True, target.can_be_awarded(owned_badges))

        # Try minimum requirements
        owned_badges = Badge.objects.filter(name__in=['req1',
                                                      'req2',
                                                      'opt1',
                                                      ])
        self.assertEqual(True, target.can_be_awarded(owned_badges))
        owned_badges = Badge.objects.filter(name__in=['req1',
                                                      'req2',
                                                      'opt2',
                                                      ])
        self.assertEqual(True, target.can_be_awarded(owned_badges))

        # Try missing required:
        owned_badges = Badge.objects.filter(name__in=[
                                                      'req2',
                                                      'opt1',
                                                      ])
        self.assertEqual(list(Badge.objects.filter(name='req1')),
                         target.can_be_awarded(owned_badges))
        owned_badges = Badge.objects.filter(name__in=[
            'req1',
            'opt1',
        ])
        self.assertEqual(list(Badge.objects.filter(name='req2')),
                         target.can_be_awarded(owned_badges))

        # Try missing optionals:
        owned_badges = Badge.objects.filter(name__in=[
            'req1',
            'req2',
        ])
        self.assertEqual(list(Badge.objects.filter(name__in=['opt1', 'opt2'])),
                         target.can_be_awarded(owned_badges))

    def test_related_badges(self):
        #  b1
        #  b2  b3
        #  b4

        b1 = Badge.objects.create(name='b1')
        b2 = Badge.objects.create(name='b2')
        b3 = Badge.objects.create(name='b3')
        b4 = Badge.objects.create(name='b4')
        b5 = Badge.objects.create(name='irrelevant') # check this doens't appear!

        BadgeRelation.objects.create(fromBadge=b1, toBadge=b2, optional=False)
        BadgeRelation.objects.create(fromBadge=b2, toBadge=b4, optional=False)
        BadgeRelation.objects.create(fromBadge=b3, toBadge=b4, optional=False)
        # We should only have 1, 2 and 4, since 3 is required for 4 but not in the
        # lineage of b1 (it's not a child).
        self.assertQuerysetEqual(Badge.objects.filter(name__in=['b1', 'b2', 'b4']).order_by('id'), b1.get_related_badges())

        # All badges should appear for 4, since it has every badge in its lineage
        self.assertQuerysetEqual(Badge.objects.filter(name__in=['b1', 'b2', 'b3','b4']).order_by('id'), b4.get_related_badges())


class MermaidPrintingTestCase(TestCase):

    def test_badge_relation_printing(self):
        b1 = Badge.objects.create(name='b1')
        b2 = Badge.objects.create(name='b2')

        r1 = BadgeRelation.objects.create(fromBadge=b1,
                                          toBadge=b2,
                                          optional=False)

        self.assertEqual(str(b1.pk) + " --> " +str(b2.pk), r1.mermaid_print())

        b3 = Badge.objects.create(name='b3')
        b4 = Badge.objects.create(name='b4')
        g1 = OptionalRelation.objects.create(badge=b4,
                                             name='Option group'
                                             ,minimum_required=1)
        r1 = BadgeRelation.objects.create(fromBadge=b3,
                                          toBadge=b4,
                                          optional=True,
                                          optional_group=g1,
                                          )

        self.assertEqual(str(b3.pk) + " -. optional .-> " +str(b4.pk), r1.mermaid_print())

    def test_badge_mermaid_printing(self):
        b1 = Badge.objects.create(name='Test name')
        self.assertEqual('1[Test name]', b1.mermaid_print())

    def test_optional_subgroup_printing(self):
        b1 = Badge.objects.create(name='b1')
        og = OptionalRelation.objects.create(name='optional group 1',
                                             badge=b1,
                                             minimum_required=1)
        opt1 = Badge.objects.create(name='opt1')
        opt2 = Badge.objects.create(name='opt2')
        BadgeRelation.objects.create(fromBadge=opt1,
                                     toBadge=b1,
                                     optional=True,
                                     optional_group=og)
        BadgeRelation.objects.create(fromBadge=opt2,
                                     toBadge=b1,
                                     optional=True,
                                     optional_group=og)
        text = og.mermaid_print_subgraph()

        # TODO: Work out how to properly test this multi-line text!
        # self.assertEqual(
        #     """subgraph: group1 [optional group 1]
        #     2[opt1]
        #     2 --> 1
        #     3[opt2]
        #     3 --> 1
        #     End
        #     group1 --> 1""", text
        # )