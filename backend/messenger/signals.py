from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import ChatRoom

User = get_user_model()


@receiver(pre_save, sender=User)
def track_approval_change(sender, instance, **kwargs):
    """승인 상태 변경 추적"""
    if instance.pk:
        try:
            old_instance = User.objects.get(pk=instance.pk)
            instance._was_approved = old_instance.is_approved
        except User.DoesNotExist:
            instance._was_approved = False
    else:
        instance._was_approved = False


@receiver(post_save, sender=User)
def add_to_public_chatroom(sender, instance, created, **kwargs):
    """회원 승인 시 공용 채팅방에 자동 추가"""
    was_approved = getattr(instance, '_was_approved', False)

    # 새로 승인된 경우 또는 새로 생성된 승인된 사용자인 경우
    if instance.is_approved and (not was_approved or created):
        # 공용 채팅방 가져오기 (없으면 생성)
        public_room, room_created = ChatRoom.objects.get_or_create(
            is_public=True,
            defaults={
                'name': 'DDGolf 전체 채팅',
                'description': '모든 회원이 참여하는 공용 채팅방입니다.',
                'is_group': True,
            }
        )

        # 멤버로 추가
        if not public_room.members.filter(pk=instance.pk).exists():
            public_room.members.add(instance)
