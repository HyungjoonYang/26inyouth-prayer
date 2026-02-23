# 인유스 기도함 (26inyouth-prayer)

## 프로젝트 개요

교회 청년부 기도제목 공유 웹앱. Firebase Firestore 실시간 연동.

## 기술 스택

- React 19 + Vite + Tailwind CSS v4 (`@import "tailwindcss"` 문법)
- Firebase Firestore (실시간 구독, CRUD)
- Firebase Hosting (배포), GitHub Actions (CI/CD)

## 프로젝트 구조

```
src/
  main.jsx          # 앱 진입점
  App.jsx           # 루트 컴포넌트 (Header + PrayerBoard + FAB + PrayerForm)
  index.css         # 글로벌 스타일, Tailwind 테마 (파스텔 컬러), 커스텀 애니메이션
  firebase.js       # Firebase 초기화, Firestore 쿼리 (subscribeToPrayers, addPrayer, incrementPrayCount)
  components/
    Header.jsx      # 상단 고정 헤더
    PrayerBoard.jsx # 기도카드 목록 (CSS multi-column 레이아웃)
    PrayerCard.jsx  # 개별 기도카드 (파스텔 스티커 스타일, 랜덤 회전)
    PrayerForm.jsx  # 기도제목 작성 바텀시트
```

## 주요 컨벤션

- 컴포넌트: JSX 함수형 컴포넌트, default export
- 스타일: Tailwind CSS 유틸리티 클래스 (별도 CSS 파일 없음)
- 커스텀 컬러: `cream`, `pastel-pink`, `pastel-yellow`, `pastel-purple`, `pastel-mint`, `pastel-blue` (index.css `@theme`에 정의)
- 폰트: Pretendard Variable (CDN)
- 환경 변수: `VITE_FIREBASE_*` prefix (`import.meta.env`로 접근)

## 개발 명령어

```bash
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드 (dist/)
npm run lint      # ESLint
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
