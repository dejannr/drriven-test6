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
    cover_image_upload = forms.FileField(required=False, help_text="Upload a cover image.")
    clear_image = forms.BooleanField(required=False, label="Clear current photo")
    clear_cover_image = forms.BooleanField(required=False, label="Clear current cover image")

    class Meta:
        model = UserDetails
        fields = ('image_upload', 'cover_image_upload', 'clear_image', 'clear_cover_image',)

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Check if clear option is set, otherwise process upload
        if self.cleaned_data.get('clear_image'):
            instance.image = None
        else:
            uploaded_image = self.cleaned_data.get('image_upload')
            if uploaded_image:
                instance.image = uploaded_image.read()

        if self.cleaned_data.get('clear_cover_image'):
            instance.cover_image = None
        else:
            uploaded_cover = self.cleaned_data.get('cover_image_upload')
            if uploaded_cover:
                instance.cover_image = uploaded_cover.read()

        if commit:
            instance.save()
        return instance

class UserDetailsInline(admin.StackedInline):
    model = UserDetails
    form = UserDetailsForm
    can_delete = False
    verbose_name_plural = 'User Details'
    readonly_fields = ('image_preview', 'cover_image_preview',)

    def image_preview(self, instance):
        if instance.image:
            encoded = base64.b64encode(instance.image).decode('utf-8')
            return mark_safe(f'<img src="data:image/jpeg;base64,{encoded}" width="100" />')
        return "No image"
    image_preview.short_description = "Current Photo"

    def cover_image_preview(self, instance):
        if instance.cover_image:
            encoded = base64.b64encode(instance.cover_image).decode('utf-8')
            return mark_safe(f'<img src="data:image/jpeg;base64,{encoded}" width="100" />')
        return "No cover image"
    cover_image_preview.short_description = "Current Cover Image"

# Unregister the existing User admin if registered
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email')
    inlines = (UserDetailsInline,)
