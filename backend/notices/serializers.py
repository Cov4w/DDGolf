from rest_framework import serializers
from .models import Notice, Banner, Organization, AboutContent, Executive
from accounts.serializers import UserSerializer


class NoticeListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'author', 'visibility', 'visibility_display',
                  'is_important', 'is_hidden', 'views', 'created_at']


class NoticeDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'author', 'visibility', 'visibility_display',
                  'is_important', 'is_hidden', 'views', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'views', 'created_at', 'updated_at']


class NoticeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['title', 'content', 'is_important']


class NoticeAdminSerializer(serializers.ModelSerializer):
    """관리자용 공지사항 시리얼라이저"""
    author = UserSerializer(read_only=True)
    visibility_display = serializers.CharField(source='get_visibility_display', read_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'author', 'visibility', 'visibility_display',
                  'is_important', 'is_hidden', 'views', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'views', 'created_at', 'updated_at']


class BannerSerializer(serializers.ModelSerializer):
    """배너 시리얼라이저"""

    class Meta:
        model = Banner
        fields = ['id', 'image', 'phone_number', 'description', 'order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class OrganizationSerializer(serializers.ModelSerializer):
    """유관기관 시리얼라이저"""

    class Meta:
        model = Organization
        fields = ['id', 'name', 'logo', 'link', 'order', 'is_active']
        read_only_fields = ['id']


class AboutContentSerializer(serializers.ModelSerializer):
    """협회소개 콘텐츠 시리얼라이저"""

    class Meta:
        model = AboutContent
        fields = ['greeting_text', 'greeting_author', 'greeting_image', 'updated_at']
        read_only_fields = ['updated_at']


class ExecutiveSerializer(serializers.ModelSerializer):
    """협회 임원 시리얼라이저"""

    class Meta:
        model = Executive
        fields = ['id', 'name', 'phone', 'greeting', 'photo', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']
