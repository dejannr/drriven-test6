import base64
from django import forms
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from .models import UserDetails

User = get_user_model()

class UserDetailsForm(forms.ModelForm):
    image_upload = forms.FileField(required=False, help_text="Upload a photo.")

    class Meta:
        model = UserDetails
        fields = ('image_upload',)

    def save(self, commit=True):
        instance = super().save(commit=False)
        uploaded_file = self.cleaned_data.get('image_upload')
        if uploaded_file:
            instance.image = uploaded_file.read()
        if commit:
            instance.save()
        return instance

class UserDetailsInline(admin.StackedInline):
    model = UserDetails
    form = UserDetailsForm
    can_delete = False
    verbose_name_plural = 'User Details'
    readonly_fields = ('image_preview',)

    def image_preview(self, instance):
        if instance.image:
            encoded = base64.b64encode(instance.image).decode('utf-8')
            return mark_safe(f'<img src="data:image/jpeg;base64,{encoded}" width="100" />')
        return "No image"
    image_preview.short_description = "Current Photo"

# Unregister the existing User admin if registered
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email')
    inlines = (UserDetailsInline,)
