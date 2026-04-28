from django.contrib import admin
from .models import DocumentCategory, Document, DocumentFile


class DocumentFileInline(admin.TabularInline):
    model = DocumentFile
    extra = 0


class DocumentInline(admin.TabularInline):
    model = Document
    extra = 0
    fields = ['title', 'order']


@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    ordering = ['order']
    inlines = [DocumentInline]


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'download_count', 'order', 'created_at']
    list_filter = ['category']
    search_fields = ['title', 'description']
    inlines = [DocumentFileInline]
