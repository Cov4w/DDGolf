from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, ChatBanViewSet, ChatRoomInvitationViewSet, TotalUnreadCountView

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chatroom')
router.register(r'bans', ChatBanViewSet, basename='chatban')
router.register(r'invitations', ChatRoomInvitationViewSet, basename='invitation')

urlpatterns = [
    path('', include(router.urls)),
    path('unread/', TotalUnreadCountView.as_view(), name='total-unread'),
]
