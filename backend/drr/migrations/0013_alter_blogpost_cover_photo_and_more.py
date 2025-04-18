# Generated by Django 5.1.7 on 2025-04-18 07:46

import drr.models
import myproject.storages
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drr', '0012_alter_blogpostcategory_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='cover_photo',
            field=models.ImageField(blank=True, help_text='Cover image stored in DigitalOcean Spaces', null=True, storage=myproject.storages.SpacesMediaStorage(), upload_to=drr.models.UploadToPath('cover_photos')),
        ),
        migrations.AlterField(
            model_name='blogpostcategory',
            name='image',
            field=models.ImageField(blank=True, help_text='Category image stored in DigitalOcean Spaces', null=True, storage=myproject.storages.SpacesMediaStorage(), upload_to=drr.models.UploadToPath('category_images')),
        ),
    ]
