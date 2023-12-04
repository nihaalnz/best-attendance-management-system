from django.db import models
from teacher.models import Teacher 

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField()
    tutors = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.name