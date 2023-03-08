from django.shortcuts import redirect, render, get_object_or_404
from models import Badge, OptionalRelation


def badgeView(request, badge_pk):
    # 1. Get the badge in question
    # 2. Get all required children
    # 3. Get all optional groups
    # 4. For each optional group, get their component badges
    # 5 Repeat 2-4 for parents

    badge = get_object_or_404(Badge, pk=badge_pk)
    required_children = badge.get_children(include_optional=False)
    optional_groups = OptionalRelation.objects.filter(badge=badge)

