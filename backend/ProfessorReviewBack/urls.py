"""
URL configuration for ProfessorReviewBack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ProfAPI.views import get_professor, get_reviews_by_professor
from rest_framework_simplejwt.views import TokenRefreshView
from ProfAPI.views import (
    get_reviews_by_professor,
    RegisterAPIView,
    LoginAPIView,
    ReviewAPIView,
    ReviewDetailAPIView,
    get_subjects,
    get_professors,
    get_subject,
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('refresh/', TokenRefreshView.as_view()),
    path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('subjects/', get_subjects, name='Subjects'),
    path('professors/', get_professors, name='Professors'),
    path('subjects/<int:pk>/', get_subject, name='Subject'),
    path('professors/<int:prof_id>/reviews/', get_reviews_by_professor, name='Reviews of professor'),
    path('reviews/', ReviewAPIView.as_view(), name='Reviews'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view(), name='Review detailed'),
    path('professors/<int:prof_id>/', get_professor, name='Professor'),

]
