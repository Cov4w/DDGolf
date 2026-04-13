from rest_framework import serializers
from .models import SmsLog


class SmsLogSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True, default='')
    club_name = serializers.CharField(source='club.name', read_only=True, default='')

    class Meta:
        model = SmsLog
        fields = [
            'id', 'sender', 'sender_name', 'club', 'club_name',
            'message', 'msg_type', 'recipients_count',
            'recipients_info', 'aligo_response', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class SmsSendSerializer(serializers.Serializer):
    recipient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        help_text='수신자 ID 목록'
    )
    message = serializers.CharField(max_length=2000, help_text='메시지 내용')
    msg_type = serializers.ChoiceField(
        choices=['SMS', 'LMS'],
        default='SMS',
        help_text='메시지 유형'
    )
