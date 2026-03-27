from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, SimpleRegisterView, ProfileView, UserListView,
    UserApproveView, UserBlockView, UserUnblockView, UserChangeRoleView,
    SendVerificationCodeView, VerifyCodeView, GoogleLoginView,
    VerifyPasswordView, ChangePasswordView, CustomTokenObtainPairView
)

urlpatterns = [
    # 이메일 인증
    path('send-verification/', SendVerificationCodeView.as_view(), name='send-verification'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify-code'),

    # 인증
    path('register/', RegisterView.as_view(), name='register'),
    path('register/simple/', SimpleRegisterView.as_view(), name='register-simple'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 소셜 로그인
    path('google/login/', GoogleLoginView.as_view(), name='google-login'),

    # 프로필
    path('profile/', ProfileView.as_view(), name='profile'),
    path('verify-password/', VerifyPasswordView.as_view(), name='verify-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # 관리자
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/approve/', UserApproveView.as_view(), name='user-approve'),
    path('users/<int:pk>/block/', UserBlockView.as_view(), name='user-block'),
    path('users/<int:pk>/unblock/', UserUnblockView.as_view(), name='user-unblock'),
    path('users/<int:pk>/change-role/', UserChangeRoleView.as_view(), name='user-change-role'),
]
