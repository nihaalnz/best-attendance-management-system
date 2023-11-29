from django.db import models

# Create your models here.
class Teacher(models.Model):
    user = models.OneToOneField('auth_user.User', on_delete=models.CASCADE)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
