"""
Django settings for config project.
DDGolf - 골프 관리 홈페이지
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# .env 파일 로드
load_dotenv(BASE_DIR / '.env')

# 환경 변수에서 설정 로드 (Docker/Production 지원)
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-7%=yw$qy9d-q^ptx%2qep!u$a^i%zm9z@8n*o)vwc-)nzjv2#x')

DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third party apps
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework.authtoken",
    "corsheaders",
    "channels",
    # Allauth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # Local apps
    "accounts",
    "boards",
    "gallery",
    "messenger",
    "schedule",
    "notices",
]

SITE_ID = 1

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

# Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Channels Layer Configuration
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Database
# PostgreSQL (Production) 또는 SQLite (Development)
DB_ENGINE = os.environ.get('DB_ENGINE', 'sqlite')

if DB_ENGINE == 'postgresql':
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get('DB_NAME', 'ddgolf'),
            "USER": os.environ.get('DB_USER', 'ddgolf'),
            "PASSWORD": os.environ.get('DB_PASSWORD', ''),
            "HOST": os.environ.get('DB_HOST', 'localhost'),
            "PORT": os.environ.get('DB_PORT', '5432'),
        }
    }
else:
    # SQLite for local development
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Internationalization
LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# Simple JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Email Configuration
# 환경 변수가 설정되면 실제 이메일 발송, 없으면 콘솔 출력 (개발용)
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

if EMAIL_HOST_USER and EMAIL_HOST_PASSWORD:
    # Production: 실제 이메일 발송 (Gmail SMTP)
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = f'DDGolf <{EMAIL_HOST_USER}>'
else:
    # Development: 콘솔에 출력
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'DDGolf <noreply@ddgolf.com>'

# Allauth Configuration
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_LOGIN_METHODS = {'email'}  # 이메일로 로그인
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']  # 필수 필드
ACCOUNT_EMAIL_VERIFICATION = 'none'  # We handle verification ourselves

# Social Account Settings
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
    }
}

# dj-rest-auth settings
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'ddgolf-auth',
    'JWT_AUTH_REFRESH_COOKIE': 'ddgolf-refresh',
    'JWT_AUTH_HTTPONLY': False,
}

# Frontend URLs
FRONTEND_URL = 'http://localhost:4112'
GOOGLE_CALLBACK_URL = f'{FRONTEND_URL}/auth/google/callback'
