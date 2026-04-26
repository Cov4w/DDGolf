# DDGolf v1.8.20260426 테스트 결과 보고서

**테스트 일시**: 2026-04-26 23:05 KST
**테스트 환경**: Production (https://localhost, Daphne + Nginx)
**테스트 방법**: curl 기반 브라우저 시뮬레이션 + 빌드 번들 검증

---

## 1. 프론트엔드 서빙

| # | 테스트 | 예상 | 결과 | 상태 |
|---|--------|------|------|:----:|
| 1-1 | 메인 페이지 (https://localhost/) | HTTP 200 | HTTP 200 | PASS |
| 1-2 | 빌드 번들 존재 | index-*.js, index-*.css | index-C8FPlKUq.js, index-BVJCyGFF.css | PASS |

---

## 2. 갤러리 기능

| # | 테스트 | 예상 | 결과 | 상태 |
|---|--------|------|------|:----:|
| 2-1 | 공개 갤러리 목록 | HTTP 200, 앨범 목록 반환 | HTTP 200, 2개 앨범 반환 | PASS |
| 2-2 | 관리자 갤러리 목록 (cover_photo_id 포함) | cover_photo_id 필드 존재 | id=4 cover_photo_id=5, id=1 cover_photo_id=1 | PASS |
| 2-3 | 대표 사진 변경 API (set_cover) | HTTP 200 | HTTP 200, cover_photo_id=5 반환 | PASS |
| 2-4 | 앨범 상세 (cover_image) | cover_image URL 존재 | cover_image=https://localhost/media/gallery/photos/IMG_5654.jpeg | PASS |

---

## 3. 관리자 대시보드 - 스크롤 UX

| # | 테스트 (빌드 번들 검증) | 예상 | 결과 | 상태 |
|---|------------------------|------|------|:----:|
| 3-1 | scrollIntoView 호출 수 | 8개 이상 (8탭 + SearchableDropdown) | 9개 | PASS |
| 3-2 | 소스코드 ref 선언 (6개 탭) | 각 ref 3회씩 (선언+할당+사용) | executiveFormRef:3, historyFormRef:3, eventFormRef:3, bannerFormRef:3, orgFormRef:3, clubSettingsRef:3 | PASS |

---

## 4. 갤러리 대표 사진 선택 UI

| # | 테스트 (빌드 번들 검증) | 예상 | 결과 | 상태 |
|---|------------------------|------|------|:----:|
| 4-1 | cover_photo_id 사용 | 2회 이상 | 2회 | PASS |
| 4-2 | set_cover API 호출 | 존재 | 2회 | PASS |
| 4-3 | "클릭하여 대표 지정" 라벨 | 존재 | 2회 (생성+수정) | PASS |
| 4-4 | coverIndex prop | 존재 | 2회 | PASS |
| 4-5 | onCoverSelect prop | 존재 | 2회 | PASS |

---

## 5. 갤러리 상세 - 대표 이미지 폴백

| # | 테스트 | 예상 | 결과 | 상태 |
|---|--------|------|------|:----:|
| 5-1 | "대표 이미지" 텍스트 (빌드 번들) | 존재 | 1회 | PASS |

---

## 6. 앨범 생성 검증

| # | 테스트 | 예상 | 결과 | 상태 |
|---|--------|------|------|:----:|
| 6-1 | "사진을 1장 이상" 검증 텍스트 | 존재 | 1회 | PASS |

---

## 7. 백엔드 API 엔드포인트

| # | 엔드포인트 | 인증 | 예상 | 결과 | 상태 |
|---|-----------|:----:|------|------|:----:|
| 7-1 | GET /api/gallery/albums/ | X | 200 | 200 | PASS |
| 7-2 | GET /api/gallery/albums/admin_list/ | O | 200 | 200 | PASS |
| 7-3 | POST /api/gallery/albums/4/set_cover/5/ | O | 200 | 200 | PASS |
| 7-4 | GET /api/notices/public/ | X | 200 | 200 | PASS |
| 7-5 | GET /api/notices/banners/ | X | 200 | 200 | PASS |
| 7-6 | GET /api/notices/organizations/ | X | 200 | 200 | PASS |
| 7-7 | GET /api/notices/about/ | X | 200 | 200 | PASS |
| 7-8 | GET /api/notices/admin_list/ | O | 200 | 200 | PASS |
| 7-9 | GET /api/schedule/events/ | O | 200 | 200 | PASS |
| 7-10 | GET /api/sms/history/ | O | 200 | 200 | PASS |

---

## 종합 결과

| 구분 | 전체 | PASS | FAIL |
|------|:----:|:----:|:----:|
| 프론트엔드 서빙 | 2 | 2 | 0 |
| 갤러리 기능 | 4 | 4 | 0 |
| 스크롤 UX | 2 | 2 | 0 |
| 대표 사진 UI | 5 | 5 | 0 |
| 대표 이미지 폴백 | 1 | 1 | 0 |
| 앨범 생성 검증 | 1 | 1 | 0 |
| 백엔드 API | 10 | 10 | 0 |
| **합계** | **25** | **25** | **0** |

**전체 테스트 통과율: 25/25 (100%)**

---

## 이번 버전 (v1.8) 변경사항 요약

1. **관리자 전 탭 수정 스크롤 UX**: 수정 버튼 클릭 시 해당 폼으로 자동 스크롤 (8개 탭)
2. **갤러리 대표 사진 UX 전면 개편**: 커버 이미지 별도 업로드 제거, 사진 중 클릭으로 대표 지정
3. **갤러리 상세 대표 이미지 폴백**: 사진 없는 앨범에서 대표 이미지 표시
4. **빈 앨범 생성 방지**: 사진 필수 검증 추가
5. **Album.cover_photo FK 추가**: 대표 사진 정확 추적
6. **Daphne 서버 재시작 반영**: 백엔드 코드 변경사항 라이브 적용
