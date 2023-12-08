# course_serializer.py
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from teacher.serializer import TeacherSerializer  # Adjust the import based on your project structure
from course.models import Course

class CourseSerializer(ModelSerializer):
    tutor_names = SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_tutor_names(self, obj):
        if obj.tutors:  # Check if tutors is not None
            return ', '.join([TeacherSerializer(tutor).data.get('name') for tutor in obj.tutors.all()])
        return None

