from django.urls import path
from .views import blogpost_list, blogpost_detail, category_list, blogpost_paginated_list

urlpatterns = [
    path('blogposts/', blogpost_list, name='blogpost-list'),
    path('blogposts/page/', blogpost_paginated_list, name='blogpost-paginated-list'),
    path('blogposts/<slug:slug>/', blogpost_detail, name='blogpost-detail'),
    path('categories/', category_list, name='category-list'),
]