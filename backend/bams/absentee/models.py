# models.py
from django.db import models
from teacher.models import Teacher
from student.models import Student  # Assuming your Teacher model is in a 'teacher' app

class AbsenteeApplication(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    reason_type = models.CharField(max_length=10, choices=[('mitigating', 'Mitigating Circumstance'), ('sickleave', 'Sick Leave'), ('other', 'Other')], null=True, blank=True)
    tutors = models.ManyToManyField(Teacher, related_name='absentee_applications')
    status = models.CharField(max_length=10, choices=[('approved', 'Approved'), ('rejected', 'Rejected')], null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)
    approved_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    

    def __str__(self):
        return f"{self.start_date} to {self.end_date} - {self.reason}"
