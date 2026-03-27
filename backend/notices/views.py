from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notice
from .serializers import (
    NoticeListSerializer, NoticeDetailSerializer,
    NoticeCreateSerializer, NoticeAdminSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class PublicNoticeViewSet(viewsets.ReadOnlyModelViewSet):
    """공개 공지사항 ViewSet (로그인 불필요)"""
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Notice.objects.filter(
            visibility='public',
            is_hidden=False
        )

    def get_serializer_class(self):
        if self.action == 'list':
            return NoticeListSerializer
        return NoticeDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NoticeViewSet(viewsets.ModelViewSet):
    """회원 공지사항 ViewSet (로그인 필요)"""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Notice.objects.all()
        # 관리자가 아니면 숨김 처리된 공지사항 제외
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_hidden=False)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return NoticeListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            if self.request.user.is_staff:
                return NoticeAdminSerializer
            return NoticeCreateSerializer
        return NoticeDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_hidden(self, request, pk=None):
        """공지사항 숨김/표시 토글"""
        notice = self.get_object()
        notice.is_hidden = not notice.is_hidden
        notice.save()
        return Response({
            'message': f"공지사항이 {'숨김' if notice.is_hidden else '표시'} 처리되었습니다.",
            'is_hidden': notice.is_hidden
        })

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def admin_list(self, request):
        """관리자용 전체 공지사항 목록 (숨김 포함)"""
        queryset = Notice.objects.all()
        serializer = NoticeListSerializer(queryset, many=True)
        return Response(serializer.data)
