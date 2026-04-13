from django.db import models
from django.conf import settings


class SmsLog(models.Model):
    """SMS 발송 로그"""

    class MsgType(models.TextChoices):
        SMS = 'SMS', 'SMS'
        LMS = 'LMS', 'LMS'

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sent_sms_logs',
        verbose_name='발송자'
    )
    club = models.ForeignKey(
        'messenger.ChatRoom',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sms_logs',
        verbose_name='클럽'
    )
    message = models.TextField('메시지 내용')
    msg_type = models.CharField(
        '메시지 유형',
        max_length=3,
        choices=MsgType.choices,
        default=MsgType.SMS
    )
    recipients_count = models.PositiveIntegerField('수신자 수', default=0)
    recipients_info = models.JSONField('수신자 정보', default=list, blank=True)
    aligo_response = models.JSONField('Aligo 응답', default=dict, blank=True)
    created_at = models.DateTimeField('발송일', auto_now_add=True)

    class Meta:
        verbose_name = 'SMS 발송 로그'
        verbose_name_plural = 'SMS 발송 로그 목록'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.sender} → {self.recipients_count}명 ({self.msg_type}) - {self.created_at}'
