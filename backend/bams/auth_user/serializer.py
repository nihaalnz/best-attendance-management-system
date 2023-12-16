from rest_framework.serializers import ModelSerializer
from .models import User
from django_countries.serializers import CountryFieldMixin


class UserSerializer(CountryFieldMixin, ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "dob",
            "phone",
            "nationality",
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)