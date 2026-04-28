from django.db import models
from django.conf import settings


class Event(models.Model):
    """경기 일정"""

    class EventType(models.TextChoices):
        MATCH = 'match', '정기 경기'
        TOURNAMENT = 'tournament', '토너먼트'
        PRACTICE = 'practice', '연습'
        MEETING = 'meeting', '모임'
        OTHER = 'other', '기타'

    class Visibility(models.TextChoices):
        PUBLIC = 'public', '공용'
        MEMBER = 'member', '회원 전용'

    title = models.CharField('제목', max_length=200)
    description = models.TextField('설명', blank=True)
    event_type = models.CharField(
        '일정 유형',
        max_length=20,
        choices=EventType.choices,
        default=EventType.MATCH
    )
    location = models.CharField('장소', max_length=200, blank=True)
    location_link = models.URLField('장소 링크', max_length=500, blank=True, help_text='네이버지도, 구글맵 등 링크')
    start_date = models.DateTimeField('시작 일시')
    end_date = models.DateTimeField('종료 일시')
    max_participants = models.PositiveIntegerField('최대 참가자 수', default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events',
        verbose_name='작성자'
    )
    visibility = models.CharField(
        '노출 범위',
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.MEMBER
    )
    is_popup = models.BooleanField('팝업 표시', default=False)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '일정'
        verbose_name_plural = '일정 목록'
        ordering = ['-start_date']

    def __str__(self):
        return f'{self.title} ({self.start_date.strftime("%Y-%m-%d")})'


class EventParticipant(models.Model):
    """일정 참가자"""

    class Status(models.TextChoices):
        PENDING = 'pending', '대기'
        CONFIRMED = 'confirmed', '확정'
        CANCELLED = 'cancelled', '취소'

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='participants',
        verbose_name='일정'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_participations',
        verbose_name='참가자'
    )
    status = models.CharField(
        '상태',
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField('신청일', auto_now_add=True)

    class Meta:
        verbose_name = '참가자'
        verbose_name_plural = '참가자 목록'
        unique_together = ['event', 'user']

    def __str__(self):
        return f'{self.user.username} - {self.event.title}'
