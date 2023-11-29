from rest_framework.response import Response
from rest_framework.views import APIView
from auth_user.serializer import UserSerializer
from student.serializer import StudentSerializer

# Create your views here.
class SignUpView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            student_data = request.data | {'user': user.id}
            student_serializer = StudentSerializer(data=student_data)
            if student_serializer.is_valid():
                student_serializer.save()
                return Response('Student has been succesfully registered!', status=201)
            else:
                print('student error')
                print(student_serializer.errors)
                return Response(student_serializer.errors, status=400)
        else:
            print('user error')
            print(user_serializer.errors)
            return Response(user_serializer.errors, status=400)

            