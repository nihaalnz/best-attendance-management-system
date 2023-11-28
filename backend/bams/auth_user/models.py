from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django_countries.fields import CountryField

class User(AbstractUser):
    username = None
    email = models.EmailField("Email Address", unique=True)
    
    dob = models.DateField("Date of Birth", blank=True, null=True)
    phone = models.CharField("Phone Number", max_length=20, blank=True, null=True)
    nationality = CountryField()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()