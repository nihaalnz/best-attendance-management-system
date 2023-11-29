from django.db import models

# Create your models here.
class Student(models.Model):
    user = models.OneToOneField('auth_user.User', on_delete=models.CASCADE)
    student_id = models.CharField(max_length=10, unique=True)
    course = models.ForeignKey('course.Course', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')

    def __str__(self):
        return f'{self.student_id} - {self.user.first_name} {self.user.last_name}'