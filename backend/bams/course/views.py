from django.shortcuts import render

# courses/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CourseSerializer

class AddCourseView(APIView):
    def post(self, request):
        course_serializer = CourseSerializer(data=request.data)

        if course_serializer.is_valid():
            # Save the course without committing to the database
            course_instance = course_serializer.save(commit=False)

            # Assuming 'tutors' is an array of teacher IDs
            tutor_ids = request.data.get('tutors', [])

            # Assuming you have a Teacher model
            from teacher.models import Teacher

            # Get the Teacher instances
            tutors_instances = Teacher.objects.filter(id__in=tutor_ids)

            # Add the tutors to the course
            course_instance.tutors.set(tutors_instances)

            # Now commit the changes to the database
            course_instance.save()

            return Response("Course has been successfully added!", status=201)

        return Response(course_serializer.errors, status=400)

