from rest_framework import serializers
from .models import Badge


class BadgeSerializer(serializers.ModelSerializer):
    child_relations = serializers.SerializerMethodField()

    class Meta:
        model = Badge
        fields = ('id', 'name', 'description', 'child_relations')

    def get_child_relations(self, obj):
        return obj.get_child_relation_list()
