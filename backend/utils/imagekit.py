from django.conf import settings
from imagekitio import ImageKit

imagekit = ImageKit(private_key=settings.IMAGEKIT_PRIVATE_KEY)

IMAGEKIT_PUBLIC_KEY = settings.IMAGEKIT_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT = settings.IMAGEKIT_URL_ENDPOINT
