import requests as http_requests
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from .models import SmsLog
from .serializers import SmsLogSerializer, SmsSendSerializer


class SmsSendView(APIView):
    """SMS 발송"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        # 권한 확인: admin만 가능
        if user.role != 'admin':
            return Response(
                {'error': '관리자만 SMS를 발송할 수 있습니다.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = SmsSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        recipient_ids = serializer.validated_data['recipient_ids']
        message = serializer.validated_data['message']
        msg_type = serializer.validated_data['msg_type']

        # 수신자 조회
        recipients = User.objects.filter(id__in=recipient_ids, is_approved=True).exclude(phone='')

        if not recipients.exists():
            return Response(
                {'error': '전화번호가 있는 수신자가 없습니다.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 전화번호 목록 (하이픈 제거)
        phone_list = [r.phone.replace('-', '') for r in recipients]
        recipients_info = [
            {'id': r.id, 'username': r.username, 'phone': r.phone}
            for r in recipients
        ]

        # Aligo API 호출
        aligo_response = self._send_via_aligo(phone_list, message, msg_type)

        # 로그 저장
        sms_log = SmsLog.objects.create(
            sender=user,
            message=message,
            msg_type=msg_type,
            recipients_count=len(phone_list),
            recipients_info=recipients_info,
            aligo_response=aligo_response,
        )

        return Response({
            'message': f'{len(phone_list)}명에게 {msg_type} 발송 요청 완료',
            'log_id': sms_log.id,
            'aligo_response': aligo_response,
        }, status=status.HTTP_201_CREATED)

    def _send_via_aligo(self, phone_list, message, msg_type):
        """Aligo SMS API 호출"""
        api_key = getattr(settings, 'ALIGO_API_KEY', '')
        user_id = getattr(settings, 'ALIGO_USER_ID', '')
        sender = getattr(settings, 'ALIGO_SENDER', '')

        if not all([api_key, user_id, sender]):
            return {'result_code': '-1', 'message': 'Aligo API 설정이 없습니다.'}

        url = 'https://apis.aligo.in/send/'
        # 수신자를 콤마로 구분 (최대 1000명)
        receiver = ','.join(phone_list[:1000])

        data = {
            'key': api_key,
            'user_id': user_id,
            'sender': sender,
            'receiver': receiver,
            'msg': message,
            'msg_type': msg_type,
        }

        if msg_type == 'LMS':
            data['title'] = 'DDGolf'

        try:
            resp = http_requests.post(url, data=data, timeout=30)
            return resp.json()
        except Exception as e:
            return {'result_code': '-1', 'message': str(e)}


class SmsRemainView(APIView):
    """잔여 SMS 건수 조회"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'admin':
            return Response(
                {'error': '권한이 없습니다.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        api_key = getattr(settings, 'ALIGO_API_KEY', '')
        user_id = getattr(settings, 'ALIGO_USER_ID', '')

        if not all([api_key, user_id]):
            return Response({
                'result_code': '-1',
                'message': 'Aligo API 설정이 없습니다.',
                'SMS_CNT': 0,
                'LMS_CNT': 0,
                'MMS_CNT': 0,
                'point': 0,
            })

        url = 'https://apis.aligo.in/remain/'
        data = {
            'key': api_key,
            'user_id': user_id,
        }

        try:
            resp = http_requests.post(url, data=data, timeout=10)
            result = resp.json()
            # SMS 건수 기반 포인트 역산 (SMS 1건 = 약 8.4원)
            sms_cnt = result.get('SMS_CNT', 0)
            if isinstance(sms_cnt, (int, float)) and sms_cnt > 0:
                result['point'] = round(sms_cnt * 8.4)
            else:
                result['point'] = 0
            return Response(result)
        except Exception as e:
            return Response({
                'result_code': '-1',
                'message': str(e),
                'SMS_CNT': 0,
                'LMS_CNT': 0,
                'MMS_CNT': 0,
                'point': 0,
            })


class SmsHistoryView(APIView):
    """SMS 발송 내역 조회"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'admin':
            return Response(
                {'error': '권한이 없습니다.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        logs = SmsLog.objects.all()

        serializer = SmsLogSerializer(logs[:50], many=True)
        return Response(serializer.data)


class SmsLogDeleteView(APIView):
    """SMS 발송 내역 삭제"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        user = request.user
        if user.role != 'admin':
            return Response(
                {'error': '관리자만 삭제할 수 있습니다.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            log = SmsLog.objects.get(pk=pk)
            log.delete()
            return Response({'message': '삭제되었습니다.'}, status=status.HTTP_200_OK)
        except SmsLog.DoesNotExist:
            return Response(
                {'error': '발송 내역을 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND,
            )
