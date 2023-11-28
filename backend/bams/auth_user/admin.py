from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as UA
from .models import User

@admin.register(User)
class UserAdmin(UA):
    fieldsets = (
        (None, {"fields": ("password",)}),
        ("Personal info", {"fields": ("first_name", "last_name", "email", "dob", "phone", "nationality")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    list_display = ("email", "first_name", "last_name", "is_staff")
    ordering = ("-is_staff",)
    readonly_fields=('last_login', 'date_joined')
