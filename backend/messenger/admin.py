from django.contrib import admin
from .models import ChatRoom, Message, ChatBan, ChatRoomInvitation, ChatRoomMembership


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ['sender', 'content', 'is_read', 'created_at']


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_group', 'is_public', 'created_by', 'created_at', 'updated_at']
    list_filter = ['is_group', 'is_public', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['members']
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['room', 'sender', 'content', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['content', 'sender__username', 'room__name']


@admin.register(ChatBan)
class ChatBanAdmin(admin.ModelAdmin):
    list_display = ['room', 'user', 'ban_type', 'banned_by', 'is_active', 'created_at']
    list_filter = ['ban_type', 'is_active', 'created_at']
    search_fields = ['user__username', 'room__name', 'reason']


@admin.register(ChatRoomInvitation)
class ChatRoomInvitationAdmin(admin.ModelAdmin):
    list_display = ['room', 'user', 'invited_by', 'status', 'created_at', 'responded_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'room__name', 'invited_by__username']


@admin.register(ChatRoomMembership)
class ChatRoomMembershipAdmin(admin.ModelAdmin):
    list_display = ['room', 'user', 'notification_enabled', 'joined_at']
    list_filter = ['notification_enabled', 'joined_at']
    search_fields = ['user__username', 'room__name']
