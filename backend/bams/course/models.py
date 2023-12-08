from django.db import models

# Create your models here.
class Course(models.Model):
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField()
    tutors = models.ManyToManyField('teacher.Teacher', related_name='courses')
    
    def __str__(self):
        return self.name