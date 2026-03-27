from django.contrib import admin
from .models import Notice, Banner, Organization


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'is_important', 'views', 'created_at']
    list_filter = ['is_important', 'created_at']
    search_fields = ['title', 'content', 'author__username']


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['description', 'phone_number', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['description', 'phone_number']


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'link', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['name']
