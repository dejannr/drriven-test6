from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
from .models import BlogPost

class BlogPostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = BlogPost
        fields = '__all__'

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    list_display = ('title', 'slug', 'created_at', 'published')
    prepopulated_fields = {'slug': ('title',)}
