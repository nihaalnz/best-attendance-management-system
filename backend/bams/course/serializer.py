from rest_framework.serializers import ModelSerializer
from course.models import Course

class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'code']