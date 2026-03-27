from django.db import models
from django.conf import settings


class ChatRoom(models.Model):
    """채팅방"""
    name = models.CharField('채팅방 이름', max_length=100)
    description = models.TextField('설명', blank=True)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='chat_rooms',
        verbose_name='참여자'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_chat_rooms',
        verbose_name='생성자'
    )
    is_group = models.BooleanField('그룹 채팅', default=True)
    is_public = models.BooleanField('공용 채팅방', default=False)
    created_at = models.DateTimeField('생성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '채팅방'
        verbose_name_plural = '채팅방 목록'
        ordering = ['-updated_at']

    def __str__(self):
        return self.name

    def can_manage(self, user):
        """채팅방 관리 권한 확인 (초대/퇴출)"""
        if user.is_staff or user.role == 'admin':
            return True
        if self.created_by == user and user.role == 'instructor':
            return True
        return False


class Message(models.Model):
    """채팅 메시지"""
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='채팅방'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='발신자'
    )
    content = models.TextField('내용')
    is_read = models.BooleanField('읽음', default=False)
    is_deleted = models.BooleanField('삭제됨', default=False)
    created_at = models.DateTimeField('전송 시간', auto_now_add=True)

    class Meta:
        verbose_name = '메시지'
        verbose_name_plural = '메시지 목록'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.sender.username}: {self.content[:30]}'


class ChatRoomInvitation(models.Model):
    """채팅방 초대"""

    class Status(models.TextChoices):
        PENDING = 'pending', '대기 중'
        ACCEPTED = 'accepted', '수락됨'
        REJECTED = 'rejected', '거절됨'

    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='invitations',
        verbose_name='채팅방'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_invitations',
        verbose_name='초대 대상'
    )
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_invitations',
        verbose_name='초대자'
    )
    status = models.CharField(
        '상태',
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField('초대일', auto_now_add=True)
    responded_at = models.DateTimeField('응답일', null=True, blank=True)

    class Meta:
        verbose_name = '채팅방 초대'
        verbose_name_plural = '채팅방 초대 목록'
        ordering = ['-created_at']
        unique_together = ['room', 'user', 'status']

    def __str__(self):
        return f'{self.user.username} - {self.room.name} ({self.get_status_display()})'


class ChatRoomMembership(models.Model):
    """채팅방 멤버십 (알림 설정 등)"""
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='memberships',
        verbose_name='채팅방'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_memberships',
        verbose_name='회원'
    )
    notification_enabled = models.BooleanField('알림 활성화', default=True)
    last_read_at = models.DateTimeField('마지막 읽은 시간', null=True, blank=True)
    joined_at = models.DateTimeField('참여일', auto_now_add=True)

    class Meta:
        verbose_name = '채팅방 멤버십'
        verbose_name_plural = '채팅방 멤버십 목록'
        unique_together = ['room', 'user']

    def __str__(self):
        return f'{self.user.username} - {self.room.name}'


class ChatBan(models.Model):
    """채팅 제재"""

    class BanType(models.TextChoices):
        MUTE = 'mute', '채팅 금지'
        KICK = 'kick', '강제 퇴장'
        BAN = 'ban', '영구 차단'

    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='bans',
        verbose_name='채팅방'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_bans',
        verbose_name='제재 대상'
    )
    banned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='issued_bans',
        verbose_name='제재자'
    )
    ban_type = models.CharField(
        '제재 유형',
        max_length=20,
        choices=BanType.choices,
        default=BanType.MUTE
    )
    reason = models.TextField('제재 사유', blank=True)
    expires_at = models.DateTimeField('제재 만료일', null=True, blank=True)
    is_active = models.BooleanField('활성', default=True)
    created_at = models.DateTimeField('제재일', auto_now_add=True)

    class Meta:
        verbose_name = '채팅 제재'
        verbose_name_plural = '채팅 제재 목록'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} - {self.get_ban_type_display()}'
