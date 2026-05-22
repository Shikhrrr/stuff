from rest_framework import serializers

from django.core.exceptions import ValidationError as DjangoValidationError

from utils.imagekit import validate_image_file

from .models import Category, Product, ProductImage
from .services import replace_primary_image, save_gallery

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='image', read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'order']

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    gallery = serializers.SerializerMethodField()
    # Stable API aliases — responses keep primary_image_url + gallery URL list
    primary_image_url = serializers.CharField(source='image', read_only=True, allow_null=True)
    gallery_image_urls = serializers.JSONField(write_only=True, required=False)
    image_upload = serializers.ImageField(write_only=True, required=False)
    category_name = serializers.CharField(source='category.label', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name', 'price', 'original_price', 'description',
            'sizes', 'tags', 'image', 'imagekit_file_id', 'primary_image_url',
            'gallery', 'gallery_image_urls', 'image_upload', 'rating', 'reviews',
            'in_stock', 'created_at', 'updated_at',
        ]
        read_only_fields = ['imagekit_file_id', 'created_at', 'updated_at']

    def get_gallery(self, obj):
        return [img.image for img in obj.gallery.all() if img.image]

    def validate_image_upload(self, value):
        try:
            validate_image_file(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        if request:
            for uploaded in request.FILES.getlist('gallery_files'):
                try:
                    validate_image_file(uploaded)
                except DjangoValidationError as exc:
                    raise serializers.ValidationError({'gallery_files': exc.messages})
        return attrs

    def _get_gallery_files(self):
        request = self.context.get('request')
        if not request:
            return []
        return request.FILES.getlist('gallery_files')

    def create(self, validated_data):
        gallery_urls = validated_data.pop('gallery_image_urls', None) or []
        image_upload = validated_data.pop('image_upload', None)
        image_url = validated_data.pop('image', None)
        product = Product.objects.create(**validated_data)

        if image_upload:
            replace_primary_image(product, image_upload)
        elif image_url:
            product.image = image_url
            product.save(update_fields=['image'])

        gallery_files = self._get_gallery_files()
        if gallery_urls or gallery_files:
            save_gallery(product, gallery_urls, gallery_files)

        return product

    def update(self, instance, validated_data):
        from utils.imagekit import delete_image

        gallery_urls = validated_data.pop('gallery_image_urls', None)
        image_upload = validated_data.pop('image_upload', None)
        image_url = validated_data.pop('image', None)
        old_image = instance.image

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if image_upload:
            replace_primary_image(instance, image_upload)
        elif image_url is not None and image_url != old_image:
            if instance.imagekit_file_id:
                delete_image(instance.imagekit_file_id)
                instance.imagekit_file_id = None
            instance.image = image_url
            instance.save(update_fields=['image', 'imagekit_file_id'])

        gallery_files = self._get_gallery_files()
        if gallery_urls is not None or gallery_files:
            save_gallery(instance, gallery_urls or [], gallery_files)

        return instance
