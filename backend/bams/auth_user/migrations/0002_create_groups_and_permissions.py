from django.db import migrations
from django.contrib.auth.models import Permission, Group


def create_groups_and_permissions(apps, schema_editor):
    # Create 'student' group
    student_group, created = Group.objects.get_or_create(name="student")
    if created:
        print("Created 'student' group.")

    # Create 'teacher' group
    teacher_group, created = Group.objects.get_or_create(name="teacher")
    if created:
        print("Created 'teacher' group.")

    # Add permissions to 'student' group
    student_permissions = Permission.objects.filter(
        codename__in=[
            "view_teacher",
            "view_course",
            "view_class",
            "view_student",
            "view_attendance",
        ]  # Add the actual permission codenames
    )
    student_group.permissions.set(student_permissions)
    print("Added permissions to 'student' group.")

    # Add permissions to 'teacher' group
    teacher_permissions = Permission.objects.filter(
        codename__in=[
            "add_user",
            "view_user",
            "view_teacher"

            "add_course",
            "view_course",
            "change_course",
            "delete_course",

            "add_class",
            "view_class",
            "change_class",
            "delete_class",

            "view_student",

            "add_attendance",
            "view_attendance",
            "change_attendance",
            "delete_attendance",
        ]  # Add the actual permission codenames
    )
    teacher_group.permissions.set(teacher_permissions)
    print("Added permissions to 'teacher' group.")


class Migration(migrations.Migration):
    dependencies = [
        # Add your dependencies here
        ("auth_user", "0001_initial")
    ]

    operations = [
        migrations.RunPython(create_groups_and_permissions),
    ]
