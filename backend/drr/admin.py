import base64
from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model
from ckeditor.widgets import CKEditorWidget
from django.utils.safestring import mark_safe
from .models import BlogPost, BlogPostCategory

User = get_user_model()

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    categories = forms.ModelMultipleChoiceField(
        queryset=BlogPostCategory.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple("Categories", is_stacked=False)
    )
    # Django will automatically give you “cover_photo” as a FileField in the form
    creator = forms.ModelChoiceField(
        queryset=User.objects.filter(is_superuser=True),
        required=False
    )

    class Meta:
        model = BlogPost
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['categories'].initial = self.instance.categories.all()

    def save(self, commit=True):
        obj = super().save(commit=False)
        if commit:
            obj.save()
            self.save_m2m()
        return obj


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ('title', 'slug', 'creator', 'created_at', 'published')
    prepopulated_fields = {'slug': ('title',)}
    actions = ['duplicate_blog_posts']

    @admin.action(description="Duplicate selected blog posts")
    def duplicate_blog_posts(self, request, queryset):
        for blog in queryset:
            # Save original many-to-many relations
            original_categories = list(blog.categories.all())
            # Duplicate the blog post instance
            blog.pk = None
            blog.id = None  # Ensure the ID is also reset.
            blog.title = f"{blog.title} (copy)"
            blog.slug = ""  # Clear slug to let prepopulated_fields or custom logic create a new slug.
            blog.save()
            # Reassign the many-to-many relationships.
            blog.categories.set(original_categories)

class BlogPostCategoryForm(forms.ModelForm):
    image_upload = forms.FileField(required=False, help_text="Upload an image.")
    clear_image = forms.BooleanField(required=False, label="Clear current image")

    class Meta:
        model = BlogPostCategory
        fields = ['name', 'blog_posts', 'image_upload', 'clear_image']

    def save(self, commit=True):
        instance = super().save(commit=False)
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
