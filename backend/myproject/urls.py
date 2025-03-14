from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include([
        path('admin/', admin.site.urls),
        # Djoser endpoints for auth (registration, login, JWT)
        path('auth/', include('djoser.urls')),
        path('auth/', include('djoser.urls.jwt')),
        # Custom user endpoint (example: profile)
        path('users/', include('users.urls')),
        # Posts endpoints
        path('posts/', include('posts.urls')),
        # Additional app endpoints
        path('drr/', include('drr.urls')),
    ])),
]
