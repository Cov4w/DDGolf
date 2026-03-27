from rest_framework import serializers
from .models import Notice
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
