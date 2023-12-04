from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.SignUpView.as_view()),
    path('login', views.LoginView.as_view()),
    path('courses', views.CoursesView.as_view()),   
    path('countries', views.CountriesView.as_view()),
    path('teachers',views.TeachersView.as_view()),
    path('addcourse',views.AddCourseView.as_view()),   
]
