# DDGolf - 골프 관리 홈페이지

## 버전 정보

**현재 버전: 1.1.20260327**

버전 형식: `메이저.마이너.날짜(YYYYMMDD)`

### 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| 1.1.20260327 | 2026-03-27 | Google OAuth 로그인/회원가입 구현, python-dotenv 적용 |
| 1.0.20260210 | 2026-02-10 | 초기 배포 (회원관리, 게시판, 갤러리, 메신저, 일정, 공지사항) |

---

## 기술 스택

- **Backend**: Django 5.x + Django REST Framework + SimpleJWT
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Database**: PostgreSQL (운영) / SQLite (개발)
- **WebSocket**: Django Channels + Daphne
- **인증**: JWT + Google OAuth 2.0
- **상태관리**: Zustand
- **배포**: Nginx + Daphne + Let's Encrypt SSL

---

## 주요 기능

- 회원가입 / 로그인 (이메일, Google OAuth)
- 관리자 승인 시스템
- 게시판 (이미지 첨부)
- 갤러리 (앨범/사진)
- 실시간 메신저 (WebSocket)
- 일정 관리
- 공지사항 / 배너 광고 / 유관기관

---

## 환경 변수

### Backend (`backend/.env`)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| SECRET_KEY | Django 시크릿 키 | (자동 생성) |
| DEBUG | 디버그 모드 | True |
| ALLOWED_HOSTS | 허용 호스트 | localhost,127.0.0.1 |
| DB_ENGINE | DB 엔진 (sqlite/postgresql) | sqlite |
| DB_NAME / DB_USER / DB_PASSWORD | DB 접속 정보 | - |
| EMAIL_HOST_USER | Gmail 계정 | (없음) |
| EMAIL_HOST_PASSWORD | Gmail 앱 비밀번호 | (없음) |
| GOOGLE_CLIENT_ID | Google OAuth Client ID | (없음) |
| GOOGLE_CLIENT_SECRET | Google OAuth Client Secret | (없음) |

### Frontend (`frontend/.env`)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| VITE_API_URL | 백엔드 API URL | /api |
| VITE_GOOGLE_CLIENT_ID | Google OAuth Client ID | (없음) |

---

## 로컬 개발

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # 환경변수 설정
python manage.py migrate
python manage.py runserver 9000

# Frontend
cd frontend
npm install
cp .env.example .env  # 환경변수 설정
npm run dev
```

## Docker 배포

### 요구사항
- Docker
- Docker Compose

```bash
cp .env.example .env
docker-compose up -d --build
```

## 관리자 계정
- 이메일: ddgolf24@ddgolf.com
- 비밀번호: dodan1004~

---

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| main | 운영 배포 |
| david | 개발 작업 |
