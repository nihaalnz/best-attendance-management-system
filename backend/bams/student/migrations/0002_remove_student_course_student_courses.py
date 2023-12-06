# Generated by Django 4.2.7 on 2023-12-05 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_remove_course_tutors_course_tutors'),
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='course',
        ),
        migrations.AddField(
            model_name='student',
            name='courses',
            field=models.ManyToManyField(related_name='students', to='course.course'),
        ),
    ]
