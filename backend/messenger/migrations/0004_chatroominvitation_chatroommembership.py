# Generated manually for ChatRoomInvitation and ChatRoomMembership models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('messenger', '0003_chatroom_created_by_chatroom_is_public'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoomInvitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '대기 중'), ('accepted', '수락됨'), ('rejected', '거절됨')], default='pending', max_length=20, verbose_name='상태')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='초대일')),
                ('responded_at', models.DateTimeField(blank=True, null=True, verbose_name='응답일')),
                ('invited_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_invitations', to=settings.AUTH_USER_MODEL, verbose_name='초대자')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitations', to='messenger.chatroom', verbose_name='채팅방')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_invitations', to=settings.AUTH_USER_MODEL, verbose_name='초대 대상')),
            ],
            options={
                'verbose_name': '채팅방 초대',
                'verbose_name_plural': '채팅방 초대 목록',
                'ordering': ['-created_at'],
                'unique_together': {('room', 'user', 'status')},
            },
        ),
        migrations.CreateModel(
            name='ChatRoomMembership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notification_enabled', models.BooleanField(default=True, verbose_name='알림 활성화')),
                ('joined_at', models.DateTimeField(auto_now_add=True, verbose_name='참여일')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memberships', to='messenger.chatroom', verbose_name='채팅방')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_memberships', to=settings.AUTH_USER_MODEL, verbose_name='회원')),
            ],
            options={
                'verbose_name': '채팅방 멤버십',
                'verbose_name_plural': '채팅방 멤버십 목록',
                'unique_together': {('room', 'user')},
            },
        ),
    ]
