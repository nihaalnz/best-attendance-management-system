from rest_framework.response import Response
from rest_framework.views import APIView
from auth_user.models import User
from auth_user.serializer import UserSerializer
from student.serializer import StudentSerializer
from teacher.serializer import TeacherSerializer
from student.models import Student
from course.models import Course
from course.serializer import CourseSerializer
from django_countries import countries
from datetime import datetime


# Create your views here.
class SignUpView(APIView):
    def post(self, request):
        account_type = request.data["accountType"]
        request.data.update(
            {"dob": datetime.fromisoformat(request.data["dob"]).strftime("%Y-%m-%d")}
        )

        sid = Student.objects.filter(student_id=request.data["student_id"])
        if sid:
            return Response(
                {"student_id": ["Student with this student_id already exists."]},
                status=400,
            )
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            if account_type == "student":
                student_data = request.data | {"user": user.id}
                student_serializer = StudentSerializer(data=student_data)
                if student_serializer.is_valid():
                    student_serializer.save()
                    return Response(
                        "Student has been succesfully registered!", status=201
                    )
                else:
                    print("student error")
                    print(student_serializer.errors)
                    return Response(student_serializer.errors, status=400)
            elif account_type == "teacher":
                teacher_data = request.data | {"user": user.id}
                teacher_serializer = TeacherSerializer(data=teacher_data)
                if teacher_serializer.is_valid():
                    teacher_serializer.save()
                    return Response(
                        "Teacher has been succesfully registered!", status=201
                    )
                else:
                    print("teacher error")
                    print(teacher_serializer.errors)
                    return Response(teacher_serializer.errors, status=400)
        else:
            print("user error")
            print(user_serializer.errors)
            return Response(user_serializer.errors, status=400)


class CoursesView(APIView):
    def get(self, request):
        instance = Course.objects.all()
        serializer = CourseSerializer(instance, many=True)
        print(instance)
        print(serializer.data)
        return Response(serializer.data, status=200)


class CountriesView(APIView):
    def get(self, request):
        return Response(
            [{"code": code, "name": name} for code, name in dict(countries).items()],
            status=200,
        )
