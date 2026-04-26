from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Album, Photo
from .serializers import (
    AlbumListSerializer, AlbumDetailSerializer, AlbumCreateSerializer,
    PhotoSerializer, AlbumAdminSerializer
)


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # 관리자는 모든 권한
        if request.user.is_staff:
            return True
        return obj.author == request.user


class AlbumViewSet(viewsets.ModelViewSet):
    """앨범 ViewSet"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        queryset = Album.objects.all()

        # 관리자가 아니면 숨김 앨범 제외
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_hidden=False)

        is_public = self.request.query_params.get('public')
        album_type = self.request.query_params.get('type')

        if is_public == 'true':
            queryset = queryset.filter(is_public=True)
        elif not self.request.user.is_authenticated:
            queryset = queryset.filter(is_public=True)

        if album_type:
            queryset = queryset.filter(album_type=album_type)

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return AlbumListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return AlbumCreateSerializer
        return AlbumDetailSerializer

    def perform_create(self, serializer):
        album = serializer.save(author=self.request.user)
        photos = self.request.FILES.getlist('photos')
        first_photo = None
        for photo_file in photos:
            p = Photo.objects.create(album=album, image=photo_file)
            if first_photo is None:
                first_photo = p
        if not album.cover_image and first_photo:
            album.cover_image = first_photo.image
            album.save(update_fields=['cover_image'])

    def perform_update(self, serializer):
        album = serializer.save()
        photos = self.request.FILES.getlist('photos')
        first_photo = None
        for photo_file in photos:
            p = Photo.objects.create(album=album, image=photo_file)
            if first_photo is None:
                first_photo = p
        if not album.cover_image and first_photo:
            album.cover_image = first_photo.image
            album.save(update_fields=['cover_image'])

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_photo(self, request, pk=None):
        album = self.get_object()
        if album.author != request.user and not request.user.is_staff:
            return Response(
                {'error': '권한이 없습니다.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = PhotoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(album=album)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='photos/(?P<photo_pk>[^/.]+)',
            permission_classes=[permissions.IsAuthenticated])
    def delete_photo(self, request, pk=None, photo_pk=None):
        album = self.get_object()
        if album.author != request.user and not request.user.is_staff:
            return Response(
                {'error': '권한이 없습니다.'},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            photo = album.photos.get(pk=photo_pk)
            photo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Photo.DoesNotExist:
            return Response(
                {'error': '사진을 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], url_path='set_cover/(?P<photo_pk>[^/.]+)',
            permission_classes=[permissions.IsAdminUser])
    def set_cover(self, request, pk=None, photo_pk=None):
        """사진을 앨범 대표 이미지로 지정"""
        album = self.get_object()
        try:
            photo = album.photos.get(pk=photo_pk)
            album.cover_image = photo.image
            album.save(update_fields=['cover_image'])
            return Response({'message': '대표 이미지가 변경되었습니다.'})
        except Photo.DoesNotExist:
            return Response(
                {'error': '사진을 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_hidden(self, request, pk=None):
        """앨범 숨김/표시 토글"""
        album = self.get_object()
        album.is_hidden = not album.is_hidden
        album.save()
        return Response({
            'message': f"앨범이 {'숨김' if album.is_hidden else '표시'} 처리되었습니다.",
            'is_hidden': album.is_hidden
        })

    @action(detail=True, methods=['post'], url_path='photos/(?P<photo_pk>[^/.]+)/toggle_hidden',
            permission_classes=[permissions.IsAdminUser])
    def toggle_photo_hidden(self, request, pk=None, photo_pk=None):
        """사진 숨김/표시 토글"""
        album = self.get_object()
        try:
            photo = album.photos.get(pk=photo_pk)
            photo.is_hidden = not photo.is_hidden
            photo.save()
            return Response({
                'message': f"사진이 {'숨김' if photo.is_hidden else '표시'} 처리되었습니다.",
                'is_hidden': photo.is_hidden
            })
        except Photo.DoesNotExist:
            return Response(
                {'error': '사진을 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def admin_list(self, request):
        """관리자용 전체 앨범 목록 (숨김 포함)"""
        queryset = Album.objects.all()
        album_type = request.query_params.get('type')
        if album_type:
            queryset = queryset.filter(album_type=album_type)
        serializer = AlbumAdminSerializer(queryset, many=True)
        return Response(serializer.data)
