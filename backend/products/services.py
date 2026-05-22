import json
import logging

from utils.imagekit import delete_image, upload_image

from .models import ProductImage

logger = logging.getLogger(__name__)


def replace_primary_image(product, uploaded_file):
    """Upload a new primary image and delete the previous ImageKit file."""
    if product.imagekit_file_id:
        delete_image(product.imagekit_file_id)
    url, file_id = upload_image(uploaded_file)
    product.image = url
    product.imagekit_file_id = file_id
    product.save(update_fields=['image', 'imagekit_file_id'])


def delete_gallery_images(gallery_qs):
    """Delete ImageKit assets for gallery rows before removing DB records."""
    for img in gallery_qs:
        delete_image(img.imagekit_file_id)


def save_gallery(product, gallery_urls=None, gallery_files=None):
    """
    Replace product gallery with URL entries and/or newly uploaded files.
    Existing ImageKit gallery files are removed when the gallery is rebuilt.
    """
    gallery_urls = gallery_urls or []
    if isinstance(gallery_urls, str):
        gallery_urls = json.loads(gallery_urls)

    existing = product.gallery.all()
    delete_gallery_images(existing)
    existing.delete()

    order = 0
    for url in gallery_urls:
        url = (url or '').strip()
        if url:
            ProductImage.objects.create(product=product, image=url, order=order)
            order += 1

    for uploaded_file in gallery_files or []:
        url, file_id = upload_image(uploaded_file)
        ProductImage.objects.create(
            product=product,
            image=url,
            imagekit_file_id=file_id,
            order=order,
        )
        order += 1
