from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from auth_user.serializer import UserSerializer
from student.serializer import StudentSerializer
from teacher.serializer import TeacherSerializer
from teacher.models import Teacher
from student.models import Student
from course.models import Course
from course.serializer import CourseSerializer
from django_countries import countries
from datetime import datetime
from django.contrib.auth.models import Group
from django.db import transaction


# Create your views here.
class SignUpView(APIView):
    def post(self, request):
        account_type = request.data["accountType"]
        group = Group.objects.get(name=account_type)

        request.data.update(
            {"dob": datetime.fromisoformat(request.data["dob"]).strftime("%Y-%m-%d")}
        )

        sid = Student.objects.filter(student_id=request.data["student_id"])
        if sid:
            return Response(
                {"student_id": ["Student with this student_id already exists."]},
                status=400,
            )

        # Extract the course IDs from the request data
        course_ids = request.data.get("course", [])

        with transaction.atomic():  # Use transaction to ensure atomicity
            user_serializer = UserSerializer(data=request.data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                user.groups.add(group)

                if account_type == "student":
                    student_data = {"user": user.id, "student_id": request.data["student_id"], "courses": course_ids}
                    student_serializer = StudentSerializer(data=student_data)
                    if student_serializer.is_valid():
                        student_serializer.save()
                        return Response(
                            "Student has been successfully registered!", status=201
                        )
                    else:
                        print("student error")
                        print(student_serializer.errors)
                        return Response(student_serializer.errors, status=400)
                elif account_type == "teacher":
                    teacher_data = {"user": user.id}
                    teacher_serializer = TeacherSerializer(data=teacher_data)
                    if teacher_serializer.is_valid():
                        teacher_serializer.save()
                        return Response(
                            "Teacher has been successfully registered!", status=201
                        )
                    else:
                        print("teacher error")
                        print(teacher_serializer.errors)
                        return Response(teacher_serializer.errors, status=400)
            else:
                print("user error")
                print(user_serializer.errors)
                return Response(user_serializer.errors, status=400)


class AddCourseView(APIView):
    def post(self, request):
        course_serializer = CourseSerializer(data=request.data)

        if course_serializer.is_valid():
            course_serializer.save()
            return Response("Course has been successfully added!", status=201)
        else:
            return Response(course_serializer.errors, status=400)


class CoursesView(APIView):
    def get(self, request):
        instance = Course.objects.all()
        serializer = CourseSerializer(instance, many=True)

        return Response(serializer.data, status=200)

class TeachersView(APIView):
    def get(self, request):
        instance = Teacher.objects.all()
        serializer = TeacherSerializer(instance, many=True)

        return Response(serializer.data, status=200)


class CountriesView(APIView):
    def get(self, request):
        return Response(
            [{"code": code, "name": name} for code, name in dict(countries).items()],
            status=200,
        )


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)  # Pointless in DRF
            role = (
                (user.groups.first().name if user.groups.first() else None)
                if not user.is_superuser
                else "admin"
            )
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "email": user.email, "role": role}, status=200
            )
        else:
            return Response({"detail": ["Invalid credentials"]}, status=401)
