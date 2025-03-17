import base64

from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
from django.utils.safestring import mark_safe

from .models import BlogPost, BlogPostCategory

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    # Add a ModelMultipleChoiceField for the categories.
    categories = forms.ModelMultipleChoiceField(
        queryset=BlogPostCategory.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Categories", is_stacked=False)
    )

    class Meta:
        model = BlogPost
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            # Populate the field with the current categories (using the reverse relation)
            self.fields['categories'].initial = self.instance.categories.all()

    def save(self, commit=True):
        # Save the BlogPost instance
        instance = super().save(commit)
        if commit:
            # Save the many-to-many categories
            instance.categories.set(self.cleaned_data['categories'])
            self.save_m2m()
        else:
            # For non-committed saves, attach a callback or handle later.
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