import re

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product
from .filters import ProductFilter
from .serializers import CategorySerializer, ProductSerializer

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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

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
        product = serializer.save(id=new_id)
        return Response(self.get_serializer(product).data, status=201)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        products = [p for p in Product.objects.all() if 'trending' in p.tags]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        product = self.get_object()
        related = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
        serializer = self.get_serializer(related, many=True)
        return Response(serializer.data)
