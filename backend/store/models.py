from django.db import models

class StoreSettings(models.Model):
    # Singleton pattern
    name = models.CharField(max_length=255, default='ShikharShoes')
    address = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Store Hours
    hours_weekday = models.CharField(max_length=100, default='10:00 AM - 8:00 PM')
    hours_saturday = models.CharField(max_length=100, default='10:00 AM - 9:00 PM')
    hours_sunday = models.CharField(max_length=100, default='11:00 AM - 7:00 PM')

    # Coordinates / Map
    map_embed_url = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)

    # Social links
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super(StoreSettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Store Settings"

class HeroSlide(models.Model):
    title = models.CharField(max_length=100)
    highlight = models.CharField(max_length=100, blank=True)
    subtitle = models.CharField(max_length=255)
    cta = models.CharField(max_length=50)
    link = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True)
    image_file = models.ImageField(upload_to='store/', null=True, blank=True)
    accent_color = models.CharField(max_length=20, default="#E8879A")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Slide: {self.title} {self.highlight}"
