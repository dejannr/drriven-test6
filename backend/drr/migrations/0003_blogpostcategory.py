# Generated by Django 5.1.7 on 2025-03-17 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drr', '0002_alter_blogpost_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogPostCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('image', models.ImageField(upload_to='blog_categories/')),
                ('blog_posts', models.ManyToManyField(blank=True, related_name='categories', to='drr.blogpost')),
            ],
        ),
    ]
