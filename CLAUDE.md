# 인유스 기도함 (26inyouth-prayer)

## 프로젝트 개요

교회 청년부 기도제목 공유 웹앱. Firebase Firestore 실시간 연동.
사용자 매뉴얼: [/markdowns/user-manual.md](/markdowns/user-manual.md)

## 기술 스택

- React 19 + Vite + Tailwind CSS v4 (`@import "tailwindcss"` 문법)
- Firebase Firestore (실시간 구독, CRUD)
- Firebase Hosting (배포), GitHub Actions (CI/CD)
- Vitest (유닛 테스트)

## 프로젝트 구조

```
src/
  main.jsx                # 앱 진입점
  App.jsx                 # 루트 컴포넌트 (Header + PrayerBoard + FAB + PrayerForm)
  index.css               # 글로벌 스타일, Tailwind 테마 (파스텔 컬러), 커스텀 애니메이션
  firebase.js             # Firebase 초기화, Firestore 쿼리
  components/
    Header.jsx            # 상단 고정 헤더 (성경구절 포함)
    PrayerBoard.jsx       # 기도카드 목록 (CSS multi-column 매소닉 레이아웃)
    PrayerCard.jsx        # 개별 기도카드 (파스텔 스티커 스타일, 랜덤 회전, 기도/수정/삭제)
    PrayerForm.jsx        # 기도제목 작성/수정 바텀시트
    PrayerDetailModal.jsx # 기도제목 상세 모달 (댓글 기능 포함)
```

## 주요 기능

- **기도제목 CRUD**: 작성, 조회, 수정(본인만), 삭제(본인만)
- **기도 카운트**: 🤲 버튼으로 기도 응답 (기기당 1회 제한, localStorage 추적)
- **댓글**: 기도카드 클릭 → 상세 모달에서 댓글 작성/조회
- **익명 지원**: 이름 미입력 시 '익명'으로 표시
- **실시간 동기화**: Firestore onSnapshot으로 즉시 반영
- **기기 기반 소유권**: deviceId(localStorage)로 본인 글 식별 → 수정/삭제 권한

## 주요 컨벤션

- 컴포넌트: JSX 함수형 컴포넌트, default export
- 스타일: Tailwind CSS 유틸리티 클래스 (별도 CSS 파일 없음)
- 커스텀 컬러: `cream`, `pastel-pink`, `pastel-yellow`, `pastel-purple`, `pastel-mint`, `pastel-blue` (index.css `@theme`에 정의)
- 폰트: Pretendard Variable (CDN)
- 환경 변수: `VITE_FIREBASE_*` prefix (`import.meta.env`로 접근)
- localStorage 키: `inyouth-device-id` (기기 식별), `inyouth-prayed` (기도한 목록)

## 개발 명령어

```bash
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드 (dist/)
npm run lint      # ESLint
npm run test      # Vitest 유닛 테스트
npm run deploy    # 빌드 + Firebase 배포
```

## 배포

- master push → GitHub Actions → Firebase Hosting 자동 배포
- PR → 프리뷰 URL 자동 생성
- Firebase 프로젝트: `inyouth-prayer`
- 도메인: https://inyouth-prayer.web.app

## Firestore 스키마

### `prayers` 컬렉션

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 작성자 이름 (빈 문자열이면 '익명') |
| content | string | 기도제목 내용 (최대 500자) |
| color | string | 카드 색상 (pink/yellow/purple/mint/blue) |
| prayCount | number | 기도 카운트 |
| createdAt | timestamp | 서버 타임스탬프 |
| deviceId | string | 작성 기기 식별자 (수정/삭제 권한 판별) |

### `prayers/{prayerId}/comments` 서브컬렉션

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 댓글 작성자 이름 (빈 문자열이면 '익명') |
| content | string | 댓글 내용 (최대 200자) |
| createdAt | timestamp | 서버 타임스탬프 |
