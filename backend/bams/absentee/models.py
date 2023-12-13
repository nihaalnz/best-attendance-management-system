# models.py
from django.db import models
from teacher.models import Teacher
from student.models import Student  # Assuming your Teacher model is in a 'teacher' app


class AbsenteeApplicationRequest(models.Model):
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    reason = models.TextField()
    tutor = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        related_name="absentee_applications",
        null=True,
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        related_name="absentee_applications",
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.student_id} - {self.start_date} {f'to {self.end_date}' if self.end_date else ''}"


class AbsenteeApplicationAction(models.Model):
    ACTION_CHOICES = [
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("pending", "Pending"),
    ]

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    application = models.OneToOneField(
        AbsenteeApplicationRequest, on_delete=models.CASCADE, related_name="action"
    )
    reason = models.TextField(null=True, blank=True, default="Please wait for tutor to respond")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'{self.application.__str__()} ({self.action})'