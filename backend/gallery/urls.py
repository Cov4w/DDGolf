from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumViewSet, GalleryCategoryViewSet

router = DefaultRouter()
router.register(r'categories', GalleryCategoryViewSet)
router.register(r'albums', AlbumViewSet, basename='album')

urlpatterns = [
    path('', include(router.urls)),
]
