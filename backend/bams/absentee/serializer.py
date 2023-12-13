# serializers.py
from rest_framework import serializers
from .models import AbsenteeApplicationRequest, AbsenteeApplicationAction
from student.models import Student  # Import Student model


class AbsenteeApplicationSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    tutor_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    request_reason = serializers.SerializerMethodField()
    response_reason = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = AbsenteeApplicationRequest
        fields = "__all__"

    def get_status(self, obj):
        return obj.action.action

    def get_tutor_name(self, obj):
        return f"{obj.tutor.user.first_name} {obj.tutor.user.last_name}"

    def get_student_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}"

    def get_request_reason(self, obj):
        return obj.reason
    
    def get_response_reason(self, obj):
        return obj.action.reason

    def get_date(self, obj):
        return f'{obj.start_date}{f" - {obj.end_date}" if obj.end_date else ""}'

class AbsenteeApplicationActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbsenteeApplicationAction
        fields = "__all__"