from django.db import models


class DocumentCategory(models.Model):
    """서식 카테고리 (규정, 규장, 서식 등)"""
    name = models.CharField('카테고리명', max_length=100)
    order = models.PositiveIntegerField('정렬 순서', default=0)

    class Meta:
        verbose_name = '서식 카테고리'
        verbose_name_plural = '서식 카테고리 목록'
        ordering = ['order']

    def __str__(self):
        return self.name


class Document(models.Model):
    """서식/규정"""
    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='카테고리'
    )
    title = models.CharField('제목', max_length=200)
    description = models.TextField('설명', blank=True)
    thumbnail = models.ForeignKey(
        'DocumentFile',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name='대표 이미지'
    )
    download_count = models.PositiveIntegerField('다운로드 수', default=0)
    order = models.PositiveIntegerField('정렬 순서', default=0)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '서식'
        verbose_name_plural = '서식 목록'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class DocumentFile(models.Model):
    """서식 첨부 파일"""
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='서식'
    )
    file = models.FileField('파일', upload_to='documents/')
    original_name = models.CharField('원본 파일명', max_length=255)
    order = models.PositiveIntegerField('정렬 순서', default=0)
    created_at = models.DateTimeField('작성일', auto_now_add=True)

    class Meta:
        verbose_name = '서식 파일'
        verbose_name_plural = '서식 파일 목록'
        ordering = ['order', 'id']

    def __str__(self):
        return self.original_name
