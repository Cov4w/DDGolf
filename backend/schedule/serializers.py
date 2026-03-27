from rest_framework import serializers
from .models import Event, EventParticipant
from accounts.serializers import UserSerializer


class EventParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ['id', 'user', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class EventListSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    participant_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'event_type', 'location', 'start_date', 'end_date',
                  'max_participants', 'participant_count', 'created_by', 'created_at']

    def get_participant_count(self, obj):
        return obj.participants.filter(status=EventParticipant.Status.CONFIRMED).count()


class EventDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    participants = EventParticipantSerializer(many=True, read_only=True)
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'event_type', 'location',
                  'start_date', 'end_date', 'max_participants', 'participants',
                  'is_participating', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_is_participating(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(user=request.user).exists()
        return False


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'event_type', 'location',
                  'start_date', 'end_date', 'max_participants']
