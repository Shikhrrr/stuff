import logging

from django.db.models.signals import post_delete
from django.dispatch import receiver

from utils.imagekit import delete_image

from .models import Product, ProductImage

logger = logging.getLogger(__name__)


@receiver(post_delete, sender=Product)
def cleanup_product_primary_image(sender, instance, **kwargs):
    """Remove primary ImageKit asset when a product is deleted."""
    delete_image(instance.imagekit_file_id)


@receiver(post_delete, sender=ProductImage)
def cleanup_gallery_image(sender, instance, **kwargs):
    """Remove gallery ImageKit asset when a gallery row is deleted."""
    delete_image(instance.imagekit_file_id)
