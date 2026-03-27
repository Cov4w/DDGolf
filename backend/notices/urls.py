from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticeViewSet, PublicNoticeViewSet, BannerViewSet, OrganizationViewSet

router = DefaultRouter()
router.register(r'', NoticeViewSet, basename='notice')

public_router = DefaultRouter()
public_router.register(r'', PublicNoticeViewSet, basename='public-notice')

banner_router = DefaultRouter()
banner_router.register(r'', BannerViewSet, basename='banner')

organization_router = DefaultRouter()
organization_router.register(r'', OrganizationViewSet, basename='organization')

urlpatterns = [
    path('public/', include(public_router.urls)),
    path('banners/', include(banner_router.urls)),
    path('organizations/', include(organization_router.urls)),
    path('', include(router.urls)),
]
