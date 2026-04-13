from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.SmsSendView.as_view(), name='sms-send'),
    path('remain/', views.SmsRemainView.as_view(), name='sms-remain'),
    path('history/', views.SmsHistoryView.as_view(), name='sms-history'),
]
