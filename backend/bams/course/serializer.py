from rest_framework.serializers import ModelSerializer, SerializerMethodField
from course.models import Course

class CourseSerializer(ModelSerializer):
    tutor_names = SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_tutor_names(self, obj):
        return ', '.join([f'{tutor.user.first_name} {tutor.user.last_name}' for tutor in obj.tutors.all()])
