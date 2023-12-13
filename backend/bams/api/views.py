from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from auth_user.serializer import UserSerializer
from student.serializer import (
    StudentSerializer,
    ViewStudentSerializer,
    ViewStudentAttendanceSerializer,
)
from teacher.serializer import TeacherSerializer
from teacher.models import Teacher
from attendance.serializer import AttendanceSerializer, AttendanceSaveSerializer
from attendance.models import Attendance
from auth_user.models import User
from student.models import Student
from course.models import Course
from course.serializer import CourseSerializer
from django_countries import countries
from datetime import datetime
from django.contrib.auth.models import Group
from django.db import transaction
from classs.models import Class
from classs.serializer import ClassSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from absentee.models import AbsenteeApplicationRequest, AbsenteeApplicationAction
from absentee.serializer import AbsenteeApplicationSerializer
from course.models import Course  # Import Course model if not already imported
from student.models import Student  # Import Student model if not already imported
from collections import defaultdict


# Create your views here.
class SignUpView(APIView):
    def post(self, request):
        print(request.data)
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
                    student_data = {
                        "user": user.id,
                        "student_id": request.data["student_id"],
                        "courses": course_ids,
                    }
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
                    teacher_data = {
                        "user": user.id,
                        "designation": request.data["designation"],
                    }
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
    def get(self, request, course_id=None):
        if course_id:
            instance = Course.objects.get(id=course_id)
            serializer = CourseSerializer(instance)
            return Response(serializer.data, status=200)
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
                {"token": token.key, "email": user.email, "role": role, "name": f'{user.first_name} {user.last_name}'}, status=200
            )
        else:
            return Response({"detail": ["Invalid credentials"]}, status=401)


class StudentView(APIView):
    def get(self, request, class_id):
        class_ = Class.objects.get(id=class_id)
        course = class_.course
        students = course.students.all()
        student_serializer = ViewStudentSerializer(students, many=True)
        return Response(student_serializer.data, status=200)


class AttendanceView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, class_id):
        attendance = Attendance.objects.filter(class_attendance=class_id)
        print(attendance)
        return Response(AttendanceSerializer(attendance, many=True).data, status=200)

    def post(self, request, class_id):
        class_ = get_object_or_404(Class, id=class_id)
        data = request.data
        if class_.is_cancelled:
            return Response("Class is cancelled, cannot mark attendance", status=400)
        students_in_class = Student.objects.filter(courses__classes=class_)
        print(students_in_class)
        for student in students_in_class:
            attendance_exist = Attendance.objects.filter(
                class_attendance=class_, student=student
            )
            if attendance_exist:
                attendance_exist.update(status=data.get(student.student_id, "present"))
                continue
            serializer_data = {
                "class_attendance": class_.id,
                "student": student.id,
                "status": data.get(student.student_id, "present"),
            }
            attendance_serializer = AttendanceSaveSerializer(data=serializer_data)
            if attendance_serializer.is_valid():
                attendance_serializer.save()
            else:
                print("attendance error")
                print(attendance_serializer.errors)
                return Response(attendance_serializer.errors, status=400)

        return Response("Students marked successfully", status=201)


class ClassesView(APIView):
    def get(self, request: Request):
        user: User = request.user
        if user.is_superuser:
            classes = Class.objects.all()
        elif user.groups.first().name == "student":
            classes = Class.objects.filter(course__students__user=request.user)
        else:
            classes = Class.objects.filter(course__tutors__user=request.user)

        if request.query_params:
            if request.query_params.get("date[from]"):
                from_date = datetime.strptime(
                    request.query_params.get("date[from]"), "%Y-%m-%d"
                )
                print(from_date)
                classes = classes.filter(date__gte=from_date)
                if request.query_params.get("date[to]"):
                    to_date = datetime.strptime(
                        request.query_params.get("date[to]"), "%Y-%m-%d"
                    )
                    classes = classes.filter(date__lte=to_date)

            if request.query_params.get("course"):
                classes = classes.filter(course=request.query_params.get("course"))
        serializer = ClassSerializer(
            classes.order_by("-date", "-start_time", "is_cancelled"),
            many=True,
            context={
                "student_id": None
                if user.is_superuser
                else (
                    user.student.student_id
                    if user.groups.first().name == "student"
                    else None
                )
            },
        )
        return Response(serializer.data, status=200)


class UserCoursesView(APIView):
    def get(self, request):
        user: User = request.user
        if user.is_superuser:
            courses = Course.objects.all()
        elif user.groups.first().name == "student":
            courses = Course.objects.filter(students__user=request.user)
        else:
            courses = Course.objects.filter(tutors__user=request.user)
        print(courses)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=200)


class CourseStudentsAttendanceView(APIView):
    def get(self, request, course_id):
        print(course_id)
        if request.query_params:
            if request.query_params.get("date[from]"):
                from_date = datetime.strptime(
                    request.query_params.get("date[from]"), "%Y-%m-%d"
                )
                to_date = None
                if request.query_params.get("date[to]"):
                    to_date = datetime.strptime(
                        request.query_params.get("date[to]"), "%Y-%m-%d"
                    )

        date_filter = (
            Q(attendances__class_attendance__date__range=[from_date, to_date])
            if to_date
            else Q(attendances__class_attendance__date__gte=from_date)
        )
        class_filter = Q(attendances__class_attendance__course__id=course_id)

        students = Student.objects.filter(courses__id=course_id).annotate(
            total_classes=Count(
                "attendances",
                filter=class_filter & date_filter,
            ),
            present_classes=Count(
                "attendances",
                filter=Q(
                    attendances__status__in=["present", "tardy"],
                )
                & class_filter
                & date_filter,
            ),
        )

        serializer = ViewStudentAttendanceSerializer(students, many=True)
        return Response(serializer.data)


class StudentAttendanceCourseView(APIView):
    def get(self, request, course_id):
        print(request.query_params)
        user = request.user
        filter = (
            {"student__user": user}
            if user.groups.first().name == "student"
            else {"student__student_id": request.query_params.get("student_id")}
        )
        course = Course.objects.get(id=course_id)
        classes = course.classes.all()

        attendance = Attendance.objects.filter(class_attendance__in=classes, **filter)
        # print(classes)
        serializer = AttendanceSerializer(attendance, many=True)

        return Response(serializer.data, status=200)


class UpdateCourseView(APIView):
    def get_object(self, id):
        return get_object_or_404(Course, id=id)

    def get(self, request, code):
        course = self.get_object(code)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def put(self, request, course_id):
        course = self.get_object(course_id)
        serializer = CourseSerializer(course, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response("Course has been successfully updated!", status=200)

        return Response(serializer.errors, status=400)


class CourseTeachersView(APIView):
    def get(self, request, course_id):
        course = Course.objects.get(id=course_id)
        teachers = course.tutors.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data, status=200)


class AddClassView(APIView):
    def post(self, request):
        class_serializer = ClassSerializer(data=request.data)
        # print(request.data)
        if class_serializer.is_valid():
            class_serializer.save()
            return Response("Class has been successfully added!", status=201)
        else:
            return Response(class_serializer.errors, status=400)


class AbsenteeApplicationView(APIView):
    def get(self, request, application_id=None, *args, **kwargs):
        # get if student or teacher
        if application_id:
            absentee_application = AbsenteeApplicationRequest.objects.get(
                id=application_id
            )
            return Response(
                AbsenteeApplicationSerializer(absentee_application).data, status=200
            )

        type = (
            "admin" if request.user.is_superuser else request.user.groups.first().name
        )
        if type == "student":
            absentee_applications = request.user.student.absentee_applications.order_by(
                "-start_date", "-action"
            )
            serializer = AbsenteeApplicationSerializer(absentee_applications, many=True)
        elif type == "teacher":
            absentee_applications = request.user.teacher.absentee_applications.order_by(
                "-start_date", "-action"
            )
            serializer = AbsenteeApplicationSerializer(absentee_applications, many=True)
        else:
            absentee_applications = AbsenteeApplicationRequest.objects.all().order_by(
                "-start_date", "-action"
            )
            serializer = AbsenteeApplicationSerializer(absentee_applications, many=True)
        return Response(
            serializer.data,
            status=200,
        )

    def post(self, request, *args, **kwargs):
        request.data.update(
            {
                "student": request.user.student.id,
                "start_date": datetime.fromisoformat(
                    request.data.get("start_date")
                ).strftime("%Y-%m-%d"),
                "end_date": datetime.fromisoformat(end_date).strftime("%Y-%m-%d")
                if (end_date := request.data.get("end_date"))
                else None,
            }
        )
        serializer = AbsenteeApplicationSerializer(data=request.data)
        if serializer.is_valid():
            # # Save the absentee application
            absentee_application = serializer.save()

            # # Create an absentee application action
            absentee_application_action = AbsenteeApplicationAction(
                application=absentee_application,
                action="pending",
            )
            absentee_application_action.save()

        return Response(
            "AbsenteeApplicationSerializer(absentee_application).data, status=201"
        )
        # else:
        #     return Response(serializer.errors, status=400)


class AbsenteeActionView(APIView):
    def post(self, request, application_id, *args, **kwargs):
        application = AbsenteeApplicationRequest.objects.get(id=application_id)
        application_action = application.action

        application_action.action = request.data.get("action")
        application_action.reason = request.data.get("reason")
        application_action.save()

        return Response("Action has been successfully updated!", status=200)


class UpdateClassView(APIView):
    def get_object(self, id):
        return get_object_or_404(Class, id=id)

    def get(self, request, id):
        class_ = self.get_object(id)
        serializer = ClassSerializer(class_)
        return Response(serializer.data)

    def put(self, request, class_id):
        user = request.user
        class_ = self.get_object(class_id)

        request.data.update(
            {
                "course": class_.course.id,
                "cancelled_by": user.id if request.data.get("is_cancelled") else None,
            }
        )
        serializer = ClassSerializer(class_, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Class has been successfully updated!", status=200)

        return Response(serializer.errors, status=400)


class ClassView(APIView):
    def get(self, request, class_id):
        class_ = Class.objects.get(id=class_id)
        serializer = ClassSerializer(class_)
        return Response(serializer.data, status=200)


class TeacherAnalyticsView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_superuser:
            classes = Class.objects.all()
        else:
            classes = Class.objects.filter(tutor__user=user)

        attendance_data = []
        for klass in classes:
            date_str = klass.date.strftime("%Y-%m-%d")

            # Check if a dictionary with the same date already exists
            existing_entry = next(
                (entry for entry in attendance_data if entry["date"] == date_str), None
            )

            if existing_entry:
                # Update the existing dictionary
                existing_entry["present"] += Attendance.objects.filter(
                    status="present", class_attendance=klass
                ).count()
                existing_entry["absent"] += Attendance.objects.filter(
                    status="absent", class_attendance=klass
                ).count()
                existing_entry["tardy"] += Attendance.objects.filter(
                    status="tardy", class_attendance=klass
                ).count()
            else:
                # Add a new dictionary to the list
                attendance_data.append(
                    {
                        "date": date_str,
                        "present": Attendance.objects.filter(
                            status="present", class_attendance=klass
                        ).count(),
                        "absent": Attendance.objects.filter(
                            status="absent", class_attendance=klass
                        ).count(),
                        "tardy": Attendance.objects.filter(
                            status="tardy", class_attendance=klass
                        ).count(),
                    }
                )
        return Response(attendance_data, status=200)


class StudentAnalyticsView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user

        classes = Class.objects.filter(course__students=user.student)
        attendance_data = defaultdict(dict)

        for klass in classes:
            date_str = klass.date.strftime('%Y-%m-%d')

            # Check if a dictionary with the same date already exists
            existing_entry = attendance_data.get(date_str)
            try:
                if existing_entry is not None:
                    # Dictionary with the same date exists; update it with the new course data
                    existing_entry[klass.course.code] = 3 if Attendance.objects.get(class_attendance=klass, student=user.student).status == "present" else (1 if Attendance.objects.get(class_attendance=klass, student=user.student).status == "absent" else 2)
                else:
                    # Create a new dictionary for the date
                    attendance_data[date_str] = {klass.course.code: 3 if Attendance.objects.get(class_attendance=klass, student=user.student).status == "present" else (1 if Attendance.objects.get(class_attendance=klass, student=user.student).status == "absent" else 2)}
            except:
                pass
        
        result = [{"date": date, **data} for date, data in attendance_data.items()]        # print(classes)
        return Response(result, status=200)
