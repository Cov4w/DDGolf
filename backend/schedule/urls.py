from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, PublicEventViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

public_router = DefaultRouter()
public_router.register(r'events', PublicEventViewSet, basename='public-event')

urlpatterns = [
    path('', include(router.urls)),
    path('public/', include(public_router.urls)),
]
