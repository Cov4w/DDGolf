from django.db import models
from django.conf import settings


class Album(models.Model):
    """갤러리 앨범"""

    class AlbumType(models.TextChoices):
        PUBLIC = 'public', '공용 갤러리'
        MEMBER = 'member', '회원 전용 갤러리'

    title = models.CharField('제목', max_length=200)
    description = models.TextField('설명', blank=True)
    cover_image = models.ImageField('커버 이미지', upload_to='gallery/covers/', blank=True, null=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='albums',
        verbose_name='작성자'
    )
    album_type = models.CharField(
        '앨범 유형',
        max_length=20,
        choices=AlbumType.choices,
        default=AlbumType.PUBLIC
    )
    is_public = models.BooleanField('공개 여부', default=True)
    is_hidden = models.BooleanField('숨김', default=False)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '앨범'
        verbose_name_plural = '앨범 목록'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Photo(models.Model):
    """갤러리 사진"""
    album = models.ForeignKey(
        Album,
        on_delete=models.CASCADE,
        related_name='photos',
        verbose_name='앨범'
    )
    image = models.ImageField('이미지', upload_to='gallery/photos/')
    caption = models.CharField('설명', max_length=200, blank=True)
    is_hidden = models.BooleanField('숨김', default=False)
    created_at = models.DateTimeField('업로드일', auto_now_add=True)

    class Meta:
        verbose_name = '사진'
        verbose_name_plural = '사진 목록'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.album.title} - {self.caption or self.id}'
