from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.SignUpView.as_view()),
    path('login', views.LoginView.as_view()),
    path('user-courses', views.UserCoursesView.as_view()),   
    path('courses', views.CoursesView.as_view()),   
    path('countries', views.CountriesView.as_view()),
    path('teachers',views.TeachersView.as_view()),
    path('addcourse',views.AddCourseView.as_view()),   
    path('students/<int:class_id>', views.StudentView.as_view()),
    path('course/<int:course_id>/students-attendance', views.CourseStudentsAttendanceView.as_view()),
    path('student/<int:course_id>/course-attendance', views.StudentAttendanceCourseView.as_view()),
    path('attendance/<int:class_id>', views.AttendanceView.as_view()),
    path('classes', views.ClassesView.as_view()),
    path('updatecourse/<str:code>', views.UpdateCourseView.as_view()),
    path('course-teachers/<int:course_id>', views.CourseTeachersView.as_view()),
    path('add-class', views.AddClassView.as_view()),
    path('request-absentee', views.AbsenteeApplicationView.as_view()),
    path('get-student-by-email/', views.GetStudentByEmailView.as_view()),
]
