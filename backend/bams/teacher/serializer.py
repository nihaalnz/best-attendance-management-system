from rest_framework import serializers
from .models import Teacher
from auth_user.models import User  # Make sure to import the User model from the correct location

class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'