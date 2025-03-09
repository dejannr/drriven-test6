from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

User = get_user_model()

# Unregister the existing User admin if registered
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email')
