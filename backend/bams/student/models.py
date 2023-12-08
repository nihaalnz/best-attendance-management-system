# models.py
from django.db import models
from course.models import Course

class Student(models.Model):
    user = models.OneToOneField('auth_user.User', on_delete=models.CASCADE)
    student_id = models.CharField(max_length=10, unique=True)
    courses = models.ManyToManyField(Course, related_name='students')

    def __str__(self):
        return f'{self.student_id} - {self.user.first_name} {self.user.last_name}'
