# Generated by Django 5.0 on 2023-12-08 10:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('classs', '0001_initial'),
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(blank=True, choices=[('present', 'Present'), ('absent', 'Absent'), ('tardy', 'Tardy')], max_length=10, null=True)),
                ('class_attendance', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='attendance', to='classs.class')),
                ('student', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='attendances', to='student.student')),
            ],
        ),
    ]
