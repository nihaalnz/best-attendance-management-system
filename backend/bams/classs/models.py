from django.db import models
from teacher.models import Teacher

# Create your models here.
class Class(models.Model):
    course = models.OneToOneField('course.Course', on_delete=models.CASCADE, related_name='classes')
    location = models.CharField(max_length=20)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()
    is_cancelled = models.BooleanField('Is Cancelled', default=False)
    cancelled_by = models.ForeignKey('auth_user.User', on_delete=models.SET_NULL, null=True, related_name='cancelled_classes', blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Class'
        verbose_name_plural = 'Classes'

    def __str__(self):
        return f'"{self.course.name}" in {self.location} - {self.date} {self.start_time}'