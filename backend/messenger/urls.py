from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, ChatBanViewSet, ChatRoomInvitationViewSet, TotalUnreadCountView, PublicClubListView, ClubMembershipRequestViewSet

router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet, basename='chatroom')
router.register(r'bans', ChatBanViewSet, basename='chatban')
router.register(r'invitations', ChatRoomInvitationViewSet, basename='invitation')
router.register(r'club-requests', ClubMembershipRequestViewSet, basename='club-request')

urlpatterns = [
    path('public/clubs/', PublicClubListView.as_view(), name='public-club-list'),
    path('', include(router.urls)),
    path('unread/', TotalUnreadCountView.as_view(), name='total-unread'),
]
