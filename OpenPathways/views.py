from django.shortcuts import redirect, render, get_object_or_404
from OpenPathways.models import Badge, OptionalRelation, BadgeRelation
from rest_framework import viewsets
from .serializers import BadgeSerializer


def badgeView(request, badge_pk):
    # 1. Get the badge in question
    # 2. Get all required children
    # 3. Get all optional groups
    # 4. For each optional group, get their component badges
    # 5 Repeat 2-4 for parents

    badge = get_object_or_404(Badge, pk=badge_pk)
    required_parents = badge.get_parents(include_optional=False)
    required_relations = BadgeRelation.objects.filter(toBadge=badge, optional=False)

    optional_groups = OptionalRelation.objects.filter(badge=badge)


    return render(request, 'badgeView.html', {'badge': badge,
                                              'required_parents': required_parents,
                                              'optional_groups': optional_groups,
                                              'required_relations': required_relations})

def badgeView_test(request):

    return render(request, 'badgeView_test.html', {})

class BadgeAPIView(viewsets.ModelViewSet):
    serializer_class = BadgeSerializer
    queryset = Badge.objects.all()
