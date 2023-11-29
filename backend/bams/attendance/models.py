from django.db import models

# Create your models here.
class Attendance(models.Model):
    class_attendance = models.ForeignKey('classs.Class', on_delete=models.SET_NULL, null=True)
    student = models.ForeignKey('student.Student', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=10, choices=[('present', 'Present'), ('absent', 'Absent'), ('tardy', 'Tardy')], null=True, blank=True)

    def __str__(self):
        return f'{self.student} - {self.class_attendance} ({self.status})'