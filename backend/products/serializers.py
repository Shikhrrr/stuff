from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'order']

    def get_url(self, obj):
        return obj.get_url()

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    gallery = serializers.SerializerMethodField()
    gallery_image_urls = serializers.JSONField(write_only=True, required=False)
    category_name = serializers.CharField(source='category.label', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'price', 'original_price', 'description', 
            'sizes', 'tags', 'primary_image_url', 'gallery', 'gallery_image_urls', 'rating', 'reviews', 
            'in_stock', 'created_at', 'updated_at'
        ]

    def get_gallery(self, obj):
        request = self.context.get('request')
        urls = []
        for img in obj.gallery.all():
            url = img.get_url()
            if url and not (url.startswith('http://') or url.startswith('https://')):
                url = request.build_absolute_uri(url) if request else url
            urls.append(url)
        if not urls and obj.primary_image_url:
            url = obj.primary_image_url
            if url and not (url.startswith('http://') or url.startswith('https://')):
                url = request.build_absolute_uri(url) if request else url
            urls = [url]
        return urls
