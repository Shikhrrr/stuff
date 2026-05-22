from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoreSettingsView, HeroSlideViewSet

router = DefaultRouter()
router.register(r'slides', HeroSlideViewSet)

urlpatterns = [
    path('settings/', StoreSettingsView.as_view(), name='store-settings'),
    path('', include(router.urls)),
]
