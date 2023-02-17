from django.db import models


class Badge(models.Model):
    name = models.CharField(null=False,
                            max_length=100,
                            help_text="The name of the badge you'd like to create"
                        )
    description = models.TextField(null=True)

    def get_parents(self):
        """
        Use the relations to get all parent badges
        """
        return Badge.objects.filter(badgerelation__toBadge=self)

    def get_children(self):

        return Badge.objects.filter(badgerelation__fromBadge=self)


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


class BadgeRelation(models.Model):
    fromBadge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='iniital_badge')
    toBadge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    optional = models.BooleanField()
    optional_group = models.ForeignKey(OptionalRelation, on_delete=models.SET_NULL, null=True)

