from django.contrib import admin
from .models import AbsenteeApplicationRequest, AbsenteeApplicationAction

# Register your models here.
admin.site.register(AbsenteeApplicationRequest)
admin.site.register(AbsenteeApplicationAction)
