from django.db import models

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True) # e.g. 'women', 'men', 'kids'
    label = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, blank=True)
    banner_image = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.label

class Product(models.Model):
    id = models.CharField(max_length=50, primary_key=True) # e.g. 'w1', 'm2'
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    
    # Store sizes as JSON array e.g., [35, 36, 37]
    sizes = models.JSONField(default=list)
    # Store tags as JSON array e.g., ["trending", "new"]
    tags = models.JSONField(default=list, blank=True)
    
    # Primary image stored on ImageKit CDN
    image = models.URLField(max_length=500, blank=True, null=True)
    imagekit_file_id = models.CharField(max_length=255, blank=True, null=True)
    
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews = models.IntegerField(default=0)
    in_stock = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gallery')
    image = models.URLField(max_length=500, blank=True, null=True)
    imagekit_file_id = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
