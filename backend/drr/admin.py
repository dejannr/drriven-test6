from django.contrib import admin
from django import forms
from ckeditor.widgets import CKEditorWidget
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

@admin.register(BlogPostCategory)
class BlogPostCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    filter_horizontal = ('blog_posts',)
