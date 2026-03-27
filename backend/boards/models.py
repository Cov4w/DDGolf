from django.db import models
from django.conf import settings


class Post(models.Model):
    """게시판 글"""
    title = models.CharField('제목', max_length=200)
    content = models.TextField('내용')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name='작성자'
    )
    views = models.PositiveIntegerField('조회수', default=0)
    is_public = models.BooleanField('공개 여부', default=False)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '게시글'
        verbose_name_plural = '게시글 목록'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PostImage(models.Model):
    """게시글 첨부 이미지"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='게시글'
    )
    image = models.ImageField('이미지', upload_to='posts/')
    created_at = models.DateTimeField('업로드일', auto_now_add=True)

    class Meta:
        verbose_name = '게시글 이미지'
        verbose_name_plural = '게시글 이미지 목록'


class Comment(models.Model):
    """댓글"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='게시글'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='작성자'
    )
    content = models.TextField('내용')
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '댓글'
        verbose_name_plural = '댓글 목록'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author.username}: {self.content[:20]}'
