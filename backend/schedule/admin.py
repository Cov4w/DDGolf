from django.contrib import admin
from .models import Event, EventParticipant


class EventParticipantInline(admin.TabularInline):
    model = EventParticipant
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'location', 'start_date', 'end_date', 'created_by']
    list_filter = ['event_type', 'start_date']
    search_fields = ['title', 'description', 'location']
    inlines = [EventParticipantInline]


@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['event__title', 'user__username']
