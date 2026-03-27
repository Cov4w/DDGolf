from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Event, EventParticipant
from .serializers import (
    EventListSerializer, EventDetailSerializer, EventCreateSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class EventViewSet(viewsets.ModelViewSet):
    """일정 ViewSet"""
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Event.objects.all()
        # 날짜 필터
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateSerializer
        return EventDetailSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        """일정 참가 신청"""
        event = self.get_object()

        # 이미 참가 신청했는지 확인
        if event.participants.filter(user=request.user).exists():
            return Response(
                {'error': '이미 참가 신청한 일정입니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 최대 참가자 수 확인
        if event.max_participants > 0:
            confirmed_count = event.participants.filter(
                status=EventParticipant.Status.CONFIRMED
            ).count()
            if confirmed_count >= event.max_participants:
                return Response(
                    {'error': '참가 인원이 마감되었습니다.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        EventParticipant.objects.create(
            event=event,
            user=request.user,
            status=EventParticipant.Status.CONFIRMED
        )
        return Response({'message': '참가 신청이 완료되었습니다.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        """일정 참가 취소"""
        event = self.get_object()
        try:
            participant = event.participants.get(user=request.user)
            participant.delete()
            return Response({'message': '참가가 취소되었습니다.'})
        except EventParticipant.DoesNotExist:
            return Response(
                {'error': '참가 신청 내역이 없습니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """다가오는 일정 조회"""
        events = Event.objects.filter(
            start_date__gte=timezone.now()
        ).order_by('start_date')[:5]
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)
