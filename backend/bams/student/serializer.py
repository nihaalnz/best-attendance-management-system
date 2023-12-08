from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    IntegerField,
)
from .models import Student


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['user', 'student_id', 'courses']


class ViewStudentAttendanceSerializer(ModelSerializer):
    name = SerializerMethodField()
    attendance_ratio = SerializerMethodField()

    class Meta:
        model = Student
        fields = ["student_id", "name", "attendance_ratio"]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_attendance_ratio(self, obj):
        return f"{obj.present_classes}/{obj.total_classes}"


class ViewStudentSerializer(ModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = Student
        fields = ["student_id", "name"]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
