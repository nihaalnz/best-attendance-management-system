import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bams.settings")
import django

django.setup()

import json
from auth_user.models import User
from teacher.models import Teacher
from course.models import Course
from classs.models import Class
from student.models import Student
from attendance.models import Attendance
from django.contrib.auth.models import Group
import time
from tqdm import tqdm
from django.contrib.auth.hashers import make_password


def make_users(user_list):
    for user in user_list:
        user = User.objects.create_user(**user)
        user.save()
        pbar.update(1)


def make_teachers(teacher_list):
    for teacher in teacher_list:
        teacher = Teacher.objects.create(**teacher)
        teacher.user.groups.add(teacher_group)
        teacher.save()
        pbar.update(1)


def make_courses(course_list: list[dict]):
    for course in course_list:
        t = course.pop("tutors")
        instance = Course.objects.create(**course)
        instance.tutors.set(Teacher.objects.filter(id__in=t))
        instance.save()
        pbar.update(1)


def make_classes(class_list):
    Class.objects.bulk_create(
        [
            Class(
                **{
                    "id": klass.pop("class_id"),
                    **klass,
                    "course": Course.objects.get(id=klass["course"]),
                    "tutor": Teacher.objects.get(id=klass["tutor"]),
                }
            )
            for klass in class_list
        ]
    )


def make_students(student_list):
    for student in student_list:
        c = student.pop("courses")
        instance = Student.objects.create(**student)
        instance.user.groups.add(student_group)
        instance.courses.set(Course.objects.filter(id__in=c))
        instance.save()
        pbar.update(1)


def make_attendance(attendance_list):
    Attendance.objects.bulk_create(
        [
            Attendance(
                **{
                    "class_attendance": Class.objects.get(
                        id=attendance.pop("class_id")
                    ),
                    "student": Student.objects.get(
                        student_id=attendance.pop("student_id")
                    ),
                    **attendance,
                }
            )
            for attendance in attendance_list
        ]
    )


with open("dump.json") as f:
    teacher_group = Group.objects.get(name="teacher")
    student_group = Group.objects.get(name="student")

    start = time.time()
    data = json.load(f)
    total = (
        len(data["users"])
        + len(data["teachers"])
        + len(data["courses"])
        + len(data["classes"])
        + len(data["students"])
        + len(data["attendances"])
    )
    pbar = tqdm(total=total)
    pbar.set_description("Creating Users")
    make_users(data["users"])
    pbar.update(len(data["users"]))

    pbar.set_description("Creating Teachers")
    make_teachers(data["teachers"])

    pbar.set_description("Creating Courses")
    make_courses(data["courses"])

    pbar.set_description("Creating Classes")
    make_classes(data["classes"])
    pbar.update(len(data["classes"]))

    pbar.set_description("Creating Students")
    make_students(data["students"])

    pbar.set_description("Creating Attendances")
    make_attendance(data["attendances"])
    pbar.update(len(data["attendances"]))

    pbar.close()

    end = time.time()
    print(f"Completed populating database in {end-start} seconds")
