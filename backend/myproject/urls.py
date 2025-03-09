from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Djoser endpoints for auth (registration, login, JWT)
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    # Custom user endpoint (example: profile)
    path('users/', include('users.urls')),
    path('posts/', include('posts.urls')),  # Include posts endpoints
]
