import os
import uuid
from django.utils import timezone  # <-- correct import

from django.conf import settings

def make_upload_to(sub_folder):
    """
    Returns a callable for `upload_to` that puts files under:
      <STORAGE_FOLDER>/<sub_folder>/YYYY/MM/DD/<uuid4>.<ext>
    """
    def upload_to(instance, filename):
        ext = filename.split('.')[-1].lower()
        date_path = timezone.now().strftime("%Y/%m/%d")
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        return os.path.join(
            settings.STORAGE_FOLDER,
            sub_folder,
            date_path,
            unique_name
        )
    return upload_to