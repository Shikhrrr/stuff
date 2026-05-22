from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart
import uuid

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        # Admin sees all orders, users see their own
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-date')
        return Order.objects.filter(user=self.request.user).order_by('-date')

    def create(self, request, *args, **kwargs):
        user = request.user
        shipping_address = request.data.get('shipping_address')
        
        if not shipping_address:
            return Response({'error': 'Shipping address is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=user)
            cart_items = cart.items.all()
        except Cart.DoesNotExist:
            cart_items = []

        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart_items)
        
        # Generate unique ID
        import datetime
        order_id = f"ORD-{datetime.datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"

        # Create Order
        order = Order.objects.create(
            id=order_id,
            user=user,
            total_amount=total,
            shipping_address=shipping_address
        )

        # Create Order Items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_image=item.product.primary_image_url,
                size=item.size,
                qty=item.quantity,
                price=item.product.price
            )

        # Clear cart
        cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ('Shipped', 'Delivered'):
            return Response(
                {'error': 'Cannot cancel an order that has already been shipped or delivered.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'Cancelled'
        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
