from django.urls import path
from .views import create_blog_post

urlpatterns = [
    path('posts/', create_blog_post, name='create_blog_post'),
]