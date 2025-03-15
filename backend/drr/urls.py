from django.urls import path
from .views import blogpost_list

urlpatterns = [
    path('blogposts/', blogpost_list, name='blogpost-list'),
]