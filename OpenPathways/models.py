from django.db import models
from django.core.exceptions import ValidationError
from django.utils.html import mark_safe, format_html


class Badge(models.Model):
    name = models.CharField(null=False,
                            max_length=100,
                            help_text="The name of the badge you'd like to create"
                        )
    description = models.TextField(null=True)

    def get_parents(self, include_optional=True):
        """
        Use the relations to get all parent badges
        """
        relations = BadgeRelation.objects.filter(toBadge=self)
        if not include_optional:
            relations = relations.filter(optional=False)
        parents = Badge.objects.filter(fromBadge__in=relations)

        return parents

    def get_children(self, include_optional=True):
        relations = BadgeRelation.objects.filter(fromBadge=self).distinct()

        if not include_optional:
            relations = relations.filter(optional=False)
        children = Badge.objects.filter(toBadge__in=relations)
        return children

    def get_child_relation_list(self):
        relations = BadgeRelation.objects.filter(fromBadge=self).distinct()
        list = []
        for relation in relations:
            list.append({
                'from': self.id,
                'to': relation.toBadge.id,
                'optional': relation.optional,
                'relation': relation.id
            })
        return list

    def can_be_awarded(self, previous_badges):
        """
        Tests  if a badge can be awarded, given the badges already owned.
        ...

        :param previous_badges: A queryset of badges currently held
        :return: True if this badge is elibile for award, and a queryset of
        missing badges if not elibible
        """
        # Check required previous badges:
        required = self.get_parents(include_optional=False)

        missing = required.difference(previous_badges)
        missing_badges = list(missing)
        # 1. Get all optional relations.
        optionals = OptionalRelation.objects.filter(badge=self)
        for requirement in optionals:
            optional_relations = BadgeRelation.objects.filter(optional_group=requirement)
            optional_badges = Badge.objects.filter(fromBadge__in=optional_relations)
            owned = previous_badges.intersection(optional_badges)
            debug = list(optional_badges)
            total_owned = owned.count()

            if total_owned >= requirement.minimum_required:
                continue
            else:
                missing_badges =  missing_badges + list(optional_badges.difference(previous_badges))

        if len(missing_badges) > 0:
            return missing_badges
        else:
            return True

    def __str__(self):
        return self.name

    def mermaid_callback_print(self):
        return "click " + str(self.id) + " fake_callback" +str(self.id)

    def mermaid_print(self):
        return str(self.pk) + "[" + self.name + "]"

    def mermaid_print_optional(self):
        return str(self.pk) + "(" + self.name + ")"

    def get_related_badges_ids(self, include_ancestors=True, include_descendants=True):
        """
        Returns all badges that are in a 'lineage' containing this badge
        This will return all children, grandchildren, parents, grandparents etc..
        :return:
        """
        related_badges = [self.id]
        if include_ancestors:
            for badge in self.get_parents():
                if badge.id in related_badges:
                    continue
                related_badges.append(badge.id)
                other_ancestors = badge.get_related_badges_ids(include_descendants=False)
                related_badges += other_ancestors

        if include_descendants:
            for badge in self.get_children():
                if badge.id in related_badges:
                    continue
                related_badges.append(badge.id)
                other_ancestors = badge.get_related_badges_ids(include_ancestors=False)
                related_badges += other_ancestors
        return related_badges

    def get_related_badges(self, include_ancestors=True, include_descendants=True):
        return Badge.objects.filter(id__in=self.get_related_badges_ids(include_ancestors, include_descendants)).distinct().order_by('id')


class OptionalRelation(models.Model):
    """
    If there are optional dependencies for a badge, this groups them.
    The name must be set so we can distinguish between two groups.

       For example, let's say you need:
         - ONE out of badge A, B or C
         - TWO of badge D, E, F or G
         to get badge X
        Relation 1:
            name: "option set a"
            badge = badge X
            minimum_required = 1
        Relation 2:
            name: "option set b"
            badge = badge x
            minimum_required = 2

    The individual relations are then set by BadgeRelations below, and must be optional.
    """
    name = models.CharField(null=False,
                            max_length=100)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    minimum_required = models.IntegerField()

    def __str__(self):
        return self.name

    def mermaid_print_subgraph(self):
        """
        Generates the markdown-like text that Mermaid needs to create this
        optoinal badge in a group.
        :return: String that can be printed.
        """
        text = ['subgraph group' + str(self.id) + ' [' + self.name + ']\n', ]
        relations = BadgeRelation.objects.filter(optional_group=self)

        for relation in relations:
            text.append(relation.fromBadge.mermaid_print())
            text.append(relation.fromBadge.mermaid_callback_print())

        text.append('end\n')
        relation_text = format_html("group{} -. minimum {} required .-> {}", str(self.id), str(self.minimum_required), str(self.badge.id))
        # text.append('group' + str(self.id) + mark_safe(" -. optional .-> ") + str(self.badge.id))
        text.append(relation_text)
        return text


class BadgeRelation(models.Model):
    fromBadge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='fromBadge')
    toBadge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='toBadge')
    optional = models.BooleanField(default=False)
    optional_group = models.ForeignKey(OptionalRelation, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.fromBadge) + ' --> ' + str(self.toBadge)

    def save(self, *args, **kwargs):
        if self.optional:
            if not self.optional_group:
                raise ValidationError("Optional relations must have an optional relationship group set")
        super(BadgeRelation, self).save(*args, **kwargs)

    def mermaid_print(self):
        if self.optional:

            return format_html("{} -. optional .-> {}", str(self.fromBadge.pk), str(self.toBadge.pk))
        else:
            return format_html("{} --> {}", str(self.fromBadge.pk), str(self.toBadge.pk))
