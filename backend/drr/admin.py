import base64

from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
from django.utils.safestring import mark_safe

from .models import BlogPost, BlogPostCategory

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    # Existing field for managing categories
    categories = forms.ModelMultipleChoiceField(
        queryset=BlogPostCategory.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Categories", is_stacked=False)
    )
    # New fields for cover photo upload/clear option
    cover_photo_upload = forms.FileField(required=False, help_text="Upload a cover photo.")
    clear_cover_photo = forms.BooleanField(required=False, label="Clear current cover photo")

    class Meta:
        model = BlogPost
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(BlogPostAdminForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            # Populate the field with the current categories (using the reverse relation)
            self.fields['categories'].initial = self.instance.categories.all()

    def save(self, commit=True):
        instance = super(BlogPostAdminForm, self).save(commit=False)
        # Process cover photo upload and clear cover photo option.
        if self.cleaned_data.get('clear_cover_photo'):
            instance.cover_photo = None
        else:
            uploaded_cover = self.cleaned_data.get('cover_photo_upload')
            if uploaded_cover:
                instance.cover_photo = uploaded_cover.read()
        if commit:
            instance.save()
            self.save_m2m()
            # Save many-to-many categories.
            instance.categories.set(self.cleaned_data['categories'])
        else:
            self.save_m2m = lambda: instance.categories.set(self.cleaned_data['categories'])
        return instance

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ('title', 'slug', 'created_at', 'published')
    prepopulated_fields = {'slug': ('title',)}

class BlogPostCategoryForm(forms.ModelForm):
    image_upload = forms.FileField(required=False, help_text="Upload an image.")
    clear_image = forms.BooleanField(required=False, label="Clear current image")

    class Meta:
        model = BlogPostCategory
        fields = ['name', 'blog_posts', 'image_upload', 'clear_image']

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Process clear option or file upload for image.
        if self.cleaned_data.get('clear_image'):
            instance.image = None
        else:
            uploaded_image = self.cleaned_data.get('image_upload')
            if uploaded_image:
                instance.image = uploaded_image.read()
        if commit:
            instance.save()
            self.save_m2m()
        return instance

@admin.register(BlogPostCategory)
class BlogPostCategoryAdmin(admin.ModelAdmin):
    form = BlogPostCategoryForm
    list_display = ('name', 'image_preview',)
    filter_horizontal = ('blog_posts',)

    def image_preview(self, instance):
        if instance.image:
            encoded = base64.b64encode(instance.image).decode('utf-8')
            return mark_safe(f'<img src="data:image/jpeg;base64,{encoded}" width="100" />')
        return "No image"
    image_preview.short_description = "Current Image"
