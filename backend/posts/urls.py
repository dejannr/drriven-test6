from django.urls import path
from .views import post_list, toggle_like

urlpatterns = [
    path('', post_list, name='post-list'),
    path('<int:pk>/like/', toggle_like, name='post-toggle-like'),
]
