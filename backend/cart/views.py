from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self._get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self._get_cart(request.user)
        cart.items.all().delete()
        return Response({'status': 'cart cleared'})

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        size = request.data.get('size')
        quantity = int(request.data.get('quantity', 1))

        if not product_id or not size:
            return Response({'error': 'Product and size are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = CartItem.objects.get(cart=cart, product_id=product_id, size=size)
            item.quantity += quantity
            item.save()
        except CartItem.DoesNotExist:
            item = CartItem.objects.create(
                cart=cart, 
                product_id=product_id, 
                size=size, 
                quantity=quantity
            )

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
