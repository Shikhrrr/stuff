import logging
import mimetypes
import os

from django.conf import settings
from django.core.exceptions import ValidationError
from imagekitio import ImageKit

logger = logging.getLogger(__name__)

imagekit = ImageKit(private_key=settings.IMAGEKIT_PRIVATE_KEY)

IMAGEKIT_PUBLIC_KEY = settings.IMAGEKIT_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT = settings.IMAGEKIT_URL_ENDPOINT

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
ALLOWED_IMAGE_CONTENT_TYPES = {
    'image/jpeg',
    'image/png',
    'image/webp',
}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
UPLOAD_FOLDER = '/products/'


def validate_image_file(uploaded_file):
    """Validate image type and size before uploading to ImageKit."""
    if not uploaded_file:
        raise ValidationError('No image file provided.')

    ext = os.path.splitext(uploaded_file.name or '')[1].lower()
    content_type = getattr(uploaded_file, 'content_type', None) or mimetypes.guess_type(uploaded_file.name or '')[0]

    if ext not in ALLOWED_IMAGE_EXTENSIONS and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise ValidationError('Invalid image format. Allowed: jpg, jpeg, png, webp.')

    size = getattr(uploaded_file, 'size', None)
    if size is not None and size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError('Image file is too large. Maximum size is 5 MB.')


def _file_payload(uploaded_file):
    """Normalize Django/other uploads to a format the ImageKit SDK accepts."""
    uploaded_file.seek(0)
    content = uploaded_file.read()
    content_type = getattr(uploaded_file, 'content_type', None) or mimetypes.guess_type(
        uploaded_file.name or ''
    )[0] or 'application/octet-stream'
    return (uploaded_file.name, content, content_type)


def upload_image(uploaded_file, *, folder=UPLOAD_FOLDER):
    """Upload a file to ImageKit; returns (cdn_url, file_id)."""
    validate_image_file(uploaded_file)
    response = imagekit.files.upload(
        file=_file_payload(uploaded_file),
        file_name=uploaded_file.name,
        folder=folder,
    )
    return response.url, response.file_id


def delete_image(file_id):
    """Delete a file from ImageKit. Never raises — logs failures instead."""
    if not file_id:
        return
    try:
        imagekit.files.delete(file_id)
    except Exception:
        logger.exception('Failed to delete ImageKit file %s', file_id)
