from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage

class SpacesMediaStorage(S3Boto3Storage):
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    custom_domain = f"{settings.AWS_STORAGE_BUCKET_NAME}.{settings.AWS_S3_ENDPOINT_URL.split('//')[1]}"
    location = 'media'   # optional: prefix all uploads under media/
