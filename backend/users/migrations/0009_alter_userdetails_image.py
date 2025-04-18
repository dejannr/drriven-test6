# Generated by Django 5.1.7 on 2025-04-18 07:48

import drr.models
import myproject.storages
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_userdetails_cover_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdetails',
            name='image',
            field=models.ImageField(blank=True, help_text='Image stored in DigitalOcean Spaces', null=True, storage=myproject.storages.SpacesMediaStorage(), upload_to=drr.models.UploadToPath('user_image')),
        ),
    ]
