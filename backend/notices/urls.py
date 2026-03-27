from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticeViewSet, PublicNoticeViewSet

router = DefaultRouter()
router.register(r'', NoticeViewSet, basename='notice')

public_router = DefaultRouter()
public_router.register(r'', PublicNoticeViewSet, basename='public-notice')

urlpatterns = [
    path('public/', include(public_router.urls)),
    path('', include(router.urls)),
]
