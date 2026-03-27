# DDGolf - 골프 관리 홈페이지

## Docker 배포

### 요구사항
- Docker
- Docker Compose

### 빠른 시작

```bash
# 1. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 설정 변경

# 2. Docker 이미지 빌드 및 실행
docker-compose up -d --build

# 3. 접속
# Frontend: http://localhost
# Backend API: http://localhost:8000
```

### 관리자 계정
- 이메일: ddgolf24@ddgolf.com
- 비밀번호: dodan1004~

### 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| SECRET_KEY | Django 시크릿 키 | (자동 생성) |
| DEBUG | 디버그 모드 | False |
| EMAIL_HOST_USER | Gmail 계정 | (없음) |
| EMAIL_HOST_PASSWORD | Gmail 앱 비밀번호 | (없음) |
| VITE_API_URL | 백엔드 API URL | http://localhost:8000 |
| VITE_GOOGLE_CLIENT_ID | Google OAuth Client ID | (없음) |

### 로컬 개발

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 9000

# Frontend
cd frontend
npm install
npm run dev
```

### 기술 스택
- Backend: Django 5.x + Django REST Framework
- Frontend: React 18 + TypeScript + Tailwind CSS
- Database: SQLite
- WebSocket: Django Channels + Daphne
