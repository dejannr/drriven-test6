# admin.py
import os, uuid
from django import forms
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from .models import UserDetails

User = get_user_model()

class UserDetailsForm(forms.ModelForm):
    image_upload = forms.ImageField(required=False, help_text="Upload a photo.")
    cover_image_upload = forms.ImageField(required=False, help_text="Upload a cover image.")
    clear_image = forms.BooleanField(required=False, label="Clear current photo")
    clear_cover_image = forms.BooleanField(required=False, label="Clear current cover image")

    class Meta:
        model = UserDetails
        fields = (
            'image_upload', 'clear_image',
            'cover_image_upload', 'clear_cover_image',
        )

    def save(self, commit=True):
        inst = super().save(commit=False)

        # PHOTO
        if self.cleaned_data.get('clear_image'):
            inst.image.delete(save=False)
        else:
            img = self.cleaned_data.get('image_upload')
            if img:
                # give it a unique filename, if you like
                name = f"{uuid.uuid4().hex}{os.path.splitext(img.name)[1]}"
                inst.image.save(name, img, save=False)

        # COVER
        if self.cleaned_data.get('clear_cover_image'):
            inst.cover_image.delete(save=False)
        else:
            cov = self.cleaned_data.get('cover_image_upload')
            if cov:
                name = f"{uuid.uuid4().hex}{os.path.splitext(cov.name)[1]}"
                inst.cover_image.save(name, cov, save=False)

        if commit:
            inst.save()
        return inst


class UserDetailsInline(admin.StackedInline):
    model = UserDetails
    form = UserDetailsForm
    can_delete = False
    verbose_name_plural = 'User Details'
    # show real <img src> previews
    readonly_fields = ('image_preview', 'cover_image_preview',)

    def image_preview(self, instance):
        if instance.image:
            return mark_safe(
                f'<img src="{instance.image.url}" width="100" />'
            )
        return "No photo"
    image_preview.short_description = "Current Photo"

    def cover_image_preview(self, instance):
        if instance.cover_image:
            return mark_safe(
                f'<img src="{instance.cover_image.url}" width="100" />'
            )
        return "No cover image"
    cover_image_preview.short_description = "Current Cover Image"


# replace the default UserAdmin
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email')
    inlines = (UserDetailsInline,)
