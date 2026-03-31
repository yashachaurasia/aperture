# urls.py
from django.urls import path
from .views import fields_list

urlpatterns = [
    path("fields/", fields_list),
]