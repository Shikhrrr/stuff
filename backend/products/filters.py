import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category_id')

    class Meta:
        model = Product
        fields = ['category', 'in_stock']
