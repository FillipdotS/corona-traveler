from rest_framework import serializers
from .models import Country

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('code', 'name', 'allowed_from', 'restriction_level')

class CountrySerializerBasic(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('code', 'name')