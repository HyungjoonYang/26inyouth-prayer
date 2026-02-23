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

## 개발 워크플로우 (TDD)

모든 개발은 Test-Driven Development로 진행한다. 아래 흐름을 반드시 따른다.

### 1. Test 생성
- 기능 구현 전에 해당 task에 대한 테스트를 먼저 작성
- 테스트 파일 위치: `src/__tests__/` 또는 대상 파일과 같은 디렉토리에 `*.test.{js,jsx}` 생성
- 테스트가 실패(RED)하는 것을 확인한 후 다음 단계로

### 2. 기능 구현
- 테스트를 통과시키기 위한 최소한의 코드 작성
- 과도한 설계 금지 — 테스트가 요구하는 만큼만 구현

### 3. Test 검증
- `npm run test`로 해당 테스트가 통과(GREEN)하는지 확인
- 실패 시 구현 코드 수정 (최대 3회 재시도 후 보고)

### 4. 정리
- 임시 스크립트, 불필요한 디버깅 코드 삭제
- `npm run lint`로 린트 점검
- `npm run build`로 빌드 정상 확인

### 5. 전체 테스트 통과
- `npm run test`로 전체 unit test suite 통과 확인
- 기존 테스트가 깨지지 않았는지 반드시 검증

### 테스트 컨벤션
- 테스트 러너: Vitest + React Testing Library
- 파일 네이밍: `{ComponentName}.test.jsx` 또는 `{moduleName}.test.js`
- 테스트 구조: `describe` → `it`/`test`, AAA 패턴 (Arrange-Act-Assert)

## 개발 명령어

```bash
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드 (dist/)
npm run lint      # ESLint
npm run test      # Vitest 전체 테스트 실행
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
