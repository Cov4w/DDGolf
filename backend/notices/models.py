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


class Banner(models.Model):
    """배너 광고"""
    image = models.ImageField('배너 이미지', upload_to='banners/')
    phone_number = models.CharField('전화번호', max_length=20)
    description = models.CharField('간단 문구', max_length=100)
    order = models.PositiveIntegerField('순서', default=0)
    is_active = models.BooleanField('활성화', default=True)
    created_at = models.DateTimeField('생성일', auto_now_add=True)

    class Meta:
        verbose_name = '배너'
        verbose_name_plural = '배너 목록'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.description


class AboutContent(models.Model):
    """협회소개 콘텐츠 (싱글톤)"""
    greeting_text = models.TextField('인사말 텍스트', blank=True, default='')
    greeting_author = models.CharField('인사말 서명', max_length=100, blank=True, default='대덕구골프협회장')
    greeting_image = models.ImageField('인사말 이미지', upload_to='about/', blank=True, null=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '협회소개 콘텐츠'
        verbose_name_plural = '협회소개 콘텐츠'

    def __str__(self):
        return '협회소개 콘텐츠'

    def save(self, *args, **kwargs):
        # 싱글톤: 항상 pk=1로 저장
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Executive(models.Model):
    """협회 임원"""
    name = models.CharField('이름', max_length=50)
    phone = models.CharField('전화번호', max_length=20, blank=True, default='')
    greeting = models.TextField('인사말', blank=True, default='')
    photo = models.ImageField('프로필 사진', upload_to='executives/', blank=True, null=True)
    order = models.PositiveIntegerField('순서', default=0)
    created_at = models.DateTimeField('등록일', auto_now_add=True)

    class Meta:
        verbose_name = '협회 임원'
        verbose_name_plural = '협회 임원 목록'
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.name


class Organization(models.Model):
    """유관기관"""
    name = models.CharField('기관명', max_length=100)
    logo = models.ImageField('로고', upload_to='organizations/')
    link = models.URLField('링크')
    order = models.PositiveIntegerField('순서', default=0)
    is_active = models.BooleanField('활성화', default=True)

    class Meta:
        verbose_name = '유관기관'
        verbose_name_plural = '유관기관 목록'
        ordering = ['order']

    def __str__(self):
        return self.name
