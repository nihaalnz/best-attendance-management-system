from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Attendance

class AttendanceSerializer(ModelSerializer):
    date = SerializerMethodField()
    student_name = SerializerMethodField()
    student_id = SerializerMethodField()
    location = SerializerMethodField()
    time = SerializerMethodField()

    class Meta:
        model = Attendance
        fields = "__all__"

    def get_date(self, obj):
        return obj.class_attendance.date.strftime("%Y-%m-%d")

    def get_student_name(self, obj):
        return f'{obj.student.user.first_name} {obj.student.user.last_name}'

    def get_student_id(self, obj):
        return obj.student.student_id

    def get_location(self, obj):
        return obj.class_attendance.location

    def get_time(self, obj):
        return f'{obj.class_attendance.start_time.strftime("%H:%M")} - {obj.class_attendance.end_time.strftime("%H:%M")}'
    
class AttendanceSaveSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"
