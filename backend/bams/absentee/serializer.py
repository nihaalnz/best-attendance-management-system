# serializers.py
from rest_framework import serializers
from .models import AbsenteeApplication
from student.models import Student  # Import Student model

class AbsenteeApplicationSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(write_only=True)

    class Meta:
        model = AbsenteeApplication
        fields = '__all__'

    def validate_student_email(self, value):
        try:
            # Fetch the corresponding student based on the provided email
            student = Student.objects.get(user__email=value)
            return student
        except Student.DoesNotExist:
            raise serializers.ValidationError(f"No student found with email {value}")

    def create(self, validated_data):
        # Remove the 'student_email' field from the validated data
        student_email = validated_data.pop('student_email', None)

        # Create the AbsenteeApplication instance
        absentee_application = super().create(validated_data)

        # If a student was found based on the email, associate it with the absentee application
        if student_email:
            absentee_application.student = student_email
            absentee_application.save()

        return absentee_application
