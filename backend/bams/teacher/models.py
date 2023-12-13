from django.db import models

# Create your models here.
class Teacher(models.Model):
    user = models.OneToOneField('auth_user.User', on_delete=models.CASCADE)
    designation = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
