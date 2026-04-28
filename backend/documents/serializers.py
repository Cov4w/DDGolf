from rest_framework import serializers
from .models import DocumentCategory, Document, DocumentFile


class DocumentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentFile
        fields = ['id', 'file', 'original_name', 'order']
        read_only_fields = ['id']


class DocumentSerializer(serializers.ModelSerializer):
    files = DocumentFileSerializer(many=True, read_only=True)
    thumbnail_id = serializers.PrimaryKeyRelatedField(
        source='thumbnail',
        queryset=DocumentFile.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Document
        fields = ['id', 'category', 'title', 'description', 'thumbnail_id',
                  'files', 'download_count', 'order', 'created_at']
        read_only_fields = ['id', 'download_count', 'created_at']


class DocumentCategorySerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = DocumentCategory
        fields = ['id', 'name', 'order', 'documents']
        read_only_fields = ['id']
