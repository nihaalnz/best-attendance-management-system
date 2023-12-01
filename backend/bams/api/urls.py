from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.SignUpView.as_view()),
    path('courses', views.CoursesView.as_view()),   
    path('countries', views.CountriesView.as_view()),   
]
