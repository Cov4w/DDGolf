from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticeViewSet, PublicNoticeViewSet, BannerViewSet, OrganizationViewSet, AboutContentView, ExecutiveViewSet, HistoryViewSet, PopupNoticeView

router = DefaultRouter()
router.register(r'', NoticeViewSet, basename='notice')

public_router = DefaultRouter()
public_router.register(r'', PublicNoticeViewSet, basename='public-notice')

banner_router = DefaultRouter()
banner_router.register(r'', BannerViewSet, basename='banner')

organization_router = DefaultRouter()
organization_router.register(r'', OrganizationViewSet, basename='organization')

executive_router = DefaultRouter()
executive_router.register(r'', ExecutiveViewSet, basename='executive')

history_router = DefaultRouter()
history_router.register(r'', HistoryViewSet, basename='history')

urlpatterns = [
    path('about/', AboutContentView.as_view(), name='about-content'),
    path('executives/', include(executive_router.urls)),
    path('histories/', include(history_router.urls)),
    path('popup/', PopupNoticeView.as_view(), name='popup-notices'),
    path('public/', include(public_router.urls)),
    path('banners/', include(banner_router.urls)),
    path('organizations/', include(organization_router.urls)),
    path('', include(router.urls)),
]
