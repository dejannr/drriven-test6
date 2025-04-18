from django.db import models
from django.contrib.auth.models import User
import os
import uuid
from django.utils import timezone  # <-- correct import

from django.conf import settings

from myproject.storages import SpacesMediaStorage

class UploadToPath:
    """
    Callable that stores files under:
      <STORAGE_FOLDER>/<sub_folder>/YYYY/MM/DD/<uuid4>.<ext>
    and is serializable for migrations.
    """
    def __init__(self, sub_folder):
        self.sub_folder = sub_folder

    def __call__(self, instance, filename):
        ext = filename.rsplit(".", 1)[-1].lower()
        date_path = timezone.now().strftime("%Y/%m/%d")
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        return os.path.join(
            settings.STORAGE_FOLDER,
            self.sub_folder,
            date_path,
            unique_name
        )

    def deconstruct(self):
        # tells Django how to serialize this callable in migrations
        return (
            "drr.models.UploadToPath",  # import path to this class
            [self.sub_folder],          # args to __init__
            {}                          # no kwargs
        )


class UserDetails(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='details'
    )
    # if you still want to keep a raw binary field for some reason, you can—
    # otherwise you might remove this entirely once you migrate.
    image = models.BinaryField(null=True, blank=True)

    cover_image = models.ImageField(
        storage=SpacesMediaStorage(),
        upload_to=UploadToPath("user_cover_images"),
        blank=True,
        null=True,
        help_text="Cover image stored in DigitalOcean Spaces"
    )

    def __str__(self):
        return f"Details for {self.user.username}"