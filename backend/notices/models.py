from django.db import models
from django.conf import settings


class Notice(models.Model):
    """공지사항"""

    class Visibility(models.TextChoices):
        PUBLIC = 'public', '공용 (비로그인 가능)'
        MEMBER = 'member', '회원 전용'

    title = models.CharField('제목', max_length=200)
    content = models.TextField('내용')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notices',
        verbose_name='작성자'
    )
    visibility = models.CharField(
        '노출 범위',
        max_length=20,
        choices=Visibility.choices,
        default=Visibility.MEMBER
    )
    is_important = models.BooleanField('중요 공지', default=False)
    is_hidden = models.BooleanField('숨김', default=False)
    views = models.PositiveIntegerField('조회수', default=0)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '공지사항'
        verbose_name_plural = '공지사항 목록'
        ordering = ['-is_important', '-created_at']

    def __str__(self):
        return self.title
