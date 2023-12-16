from rest_framework import serializers
from .models import Class
from attendance.models import Attendance


class ClassSerializer(serializers.ModelSerializer):
    course_code = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    attendance_status = serializers.SerializerMethodField()
    course_tutors = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = "__all__"

    def get_course_code(self, obj):
        return obj.course.code

    def get_course_name(self, obj):
        return obj.course.name

    def get_teacher_name(self, obj):
        return obj.tutor.user.first_name + " " + obj.tutor.user.last_name

    def get_attendance_status(self, obj):
        # Assume that you have the student_id available in the context or request
        student_id = self.context.get("student_id")
        if student_id:
            try:
                attendance = obj.attendance.get(student__student_id=student_id)
                return attendance.status.capitalize()
            except Attendance.DoesNotExist:
                return None
        else:
            return None

    def get_course_tutors(self, obj):
        return [
            {"id": tutor.id, "name": f"{tutor.user.first_name} {tutor.user.last_name}"}
            for tutor in obj.course.tutors.all()
        ]
