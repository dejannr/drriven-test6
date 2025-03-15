from django.urls import path
from .views import blogpost_list, blogpost_detail

urlpatterns = [
    path('blogposts/', blogpost_list, name='blogpost-list'),
    path('blogposts/<slug:slug>/', blogpost_detail, name='blogpost-detail'),
]