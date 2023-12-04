# course_serializer.py
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from teacher.serializer import TeacherSerializer  # Adjust the import based on your project structure
from course.models import Course

class CourseSerializer(ModelSerializer):
    tutors_name = SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'description','tutors', 'tutors_name']

    def get_tutors_name(self, obj):
        if obj.tutors:  # Check if tutors is not None
            return TeacherSerializer(obj.tutors).data.get('name')
        return None

