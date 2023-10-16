from django.urls import path
from . import views

urlpatterns = [
    path('api/lease/', views.LeaseList.as_view()),
]
