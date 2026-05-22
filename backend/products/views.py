import re
import json
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage
from .filters import ProductFilter
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'rating']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'trending', 'related']:
            return [AllowAny()]
        return [IsAdminUser()]

    def _save_gallery_items(self, product, gallery_urls, gallery_files):
        product.gallery.all().delete()
        if gallery_urls:
            for i, url in enumerate(gallery_urls):
                url = (url or '').strip()
                if url:
                    ProductImage.objects.create(
                        product=product, image_url=url, order=i
                    )
        if gallery_files:
            offset = len(gallery_urls) if gallery_urls else 0
            for i, f in enumerate(gallery_files):
                ProductImage.objects.create(
                    product=product, image_file=f, order=offset + i
                )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prefix = serializer.validated_data['category'].id[0].lower()
        existing = Product.objects.filter(id__startswith=prefix)
        max_num = 0
        for p in existing:
            m = re.search(r'(\d+)$', p.id)
            if m:
                max_num = max(max_num, int(m.group(1)))
        new_id = f'{prefix}{max_num + 1}'
        gallery_urls = serializer.validated_data.pop('gallery_image_urls', None) or []
        if isinstance(gallery_urls, str):
            import json
            gallery_urls = json.loads(gallery_urls)
        gallery_files = request.FILES.getlist('gallery_files')
        product = serializer.save(id=new_id)
        self._save_gallery_items(product, gallery_urls, gallery_files)
        return Response(self.get_serializer(product).data, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        gallery_urls = serializer.validated_data.pop('gallery_image_urls', None)
        if isinstance(gallery_urls, str):
            gallery_urls = json.loads(gallery_urls)
        gallery_files = request.FILES.getlist('gallery_files')
        product = serializer.save()
        if gallery_urls is not None or gallery_files:
            self._save_gallery_items(product, gallery_urls or [], gallery_files)
        return Response(self.get_serializer(product).data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Custom endpoint to fetch trending products based on tags"""
        # SQLite doesn't natively query JSON arrays easily via ORM in all cases, 
        # but Django 3.1+ can do simple JSON queries. Let's do it in memory if needed, 
        # or just use a basic string containment check if it's stored as simple JSON.
        products = [p for p in Product.objects.all() if 'trending' in p.tags]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
        serializer = self.get_serializer(related, many=True)
        return Response(serializer.data)
