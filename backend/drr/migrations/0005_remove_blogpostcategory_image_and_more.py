# Generated by Django 5.1.7 on 2025-03-17 20:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('drr', '0004_blogpostcategory_image_base64'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpostcategory',
            name='image',
        ),
        migrations.RemoveField(
            model_name='blogpostcategory',
            name='image_base64',
        ),
    ]
