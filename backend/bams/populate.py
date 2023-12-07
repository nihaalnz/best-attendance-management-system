import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bams.settings")
import django
django.setup()

from faker import Faker
from student.models import Student
from auth_user.models import User
from teacher.models import Teacher
from course.models import Course
from django.contrib.auth.models import Group
from tqdm import tqdm

fake = Faker()
pbar = tqdm(total=20)
course = Course.objects.get(id=1)
for i in range(20):
    student_group = Group.objects.get(name="student")
    user_data = {
        "email": fake.email(),
        "password": "secret123",
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "dob": fake.date_of_birth(),
        "phone": fake.phone_number(),
        "nationality": fake.country(),
    }
    user = User.objects.create_user(**user_data)
    user.groups.add(student_group)
    student_data = {
        "user": user,
        "student_id": f"21190{i}",
        "course": course,
    }
    Student.objects.create(**student_data)

    pbar.update(1)

pbar.close()
