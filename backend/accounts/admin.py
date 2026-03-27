from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'is_approved', 'is_active', 'created_at']
    list_filter = ['role', 'is_approved', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'phone']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('추가 정보', {'fields': ('phone', 'profile_image', 'role', 'is_approved')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('추가 정보', {'fields': ('email', 'phone', 'role')}),
    )

    actions = ['approve_users', 'block_users']

    @admin.action(description='선택된 사용자 승인')
    def approve_users(self, request, queryset):
        queryset.update(is_approved=True, role=User.Role.MEMBER)

    @admin.action(description='선택된 사용자 차단')
    def block_users(self, request, queryset):
        queryset.update(is_active=False)
