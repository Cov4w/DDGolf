from rest_framework import serializers
from .models import Album, Photo
from accounts.serializers import UserSerializer


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'caption', 'is_hidden', 'created_at']
        read_only_fields = ['id', 'created_at']


class AlbumListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    photo_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'description', 'cover_image', 'author',
                  'album_type', 'is_public', 'is_hidden', 'photo_count', 'created_at']

    def get_photo_count(self, obj):
        return obj.photos.filter(is_hidden=False).count()


class AlbumDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    photos = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'description', 'cover_image', 'author',
                  'album_type', 'is_public', 'is_hidden', 'photos', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_photos(self, obj):
        request = self.context.get('request')
        photos = obj.photos.all()
        # 관리자가 아니면 숨김 사진 제외
        if request and not request.user.is_staff:
            photos = photos.filter(is_hidden=False)
        return PhotoSerializer(photos, many=True).data


class AlbumCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ['title', 'description', 'cover_image', 'album_type', 'is_public']


class AlbumAdminSerializer(serializers.ModelSerializer):
    """관리자용 앨범 시리얼라이저"""
    author = UserSerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)
    photo_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'description', 'cover_image', 'author',
                  'album_type', 'is_public', 'is_hidden', 'photos', 'photo_count',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_photo_count(self, obj):
        return obj.photos.count()
