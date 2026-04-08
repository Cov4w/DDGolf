# DDGolf - 골프 협회 관리 시스템

> **v1.5.20260407**

## 기술 스택

### Backend
- Python 3.10 / Django 5.x / Django REST Framework
- Django Channels (WebSocket 채팅)
- Daphne ASGI 서버
- SQLite (개발) / PostgreSQL (운영)

### Frontend
- React 19 + TypeScript + Vite
- TanStack React Query (데이터 관리)
- Tailwind CSS v4
- React Router v7

## 주요 기능

### 회원 관리
- 회원 가입/승인/차단
- 역할 관리 (관리자, 클럽장, 일반 회원)
- 클럽 배정 (검색 가능 드롭다운)

### 클럽 관리 (클럽장 전용)
- 클럽 가입/탈퇴 요청 승인
- 멤버 직접 추가/제거
- 클럽 정보 수정 (아이콘, 소개글)
- 클럽 이미지 관리 (최대 10장, 캡션 편집)

### 메신저
- 실시간 채팅 (WebSocket)
- 공개 채팅방 / 클럽(비공개) 채팅방
- 초대, 알림, 제재 기능

### 일정 관리
- 이벤트 생성/수정/삭제
- 참가 신청/취소
- 공개/클럽전용 일정 구분

### 공지사항 / 갤러리
- 공지사항 CRUD (전체/클럽전용)
- 배너 슬라이더
- 앨범/사진 관리

### 협회 소개
- 인사말, 조직도, 임원진
- 클럽 현황 (이미지 슬라이더 모달)

## 실행 방법

### Backend
```bash
cd backend
source venv/bin/activate
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # 개발
npm run build    # 빌드
```

## 버전 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.5 | 2026-04-07 | 클럽 이미지 관리, 클럽 정보 수정, 멤버 CRUD, 관리자 UI 개선 |
| v1.4 | 2026-04-07 | 클럽 전용 공지사항, 클럽장 권한, 약관 페이지 |
| v1.2 | 2026-03-27 | .env 통합, 구조 정리 |
