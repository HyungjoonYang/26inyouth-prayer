<div align="center">

# 🙏 인유스 기도함

**예배인교회 청년부 In-Youth의 기도제목 나눔 공간**

서로의 기도제목을 올리고, 함께 기도해요.

[![Live](https://img.shields.io/badge/live-inyouth--prayer.web.app-FF9F43?style=for-the-badge&logo=firebase&logoColor=white)](https://inyouth-prayer.web.app)

<br />

```
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  🩷 오늘 하루 │  │  💛 감사기도  │  │  💜 중보기도  │
  │  감사한 일이  │  │  매일 주시는  │  │  아픈 친구를  │
  │  있었어요     │  │  은혜에 감사  │  │  위해 기도    │
  │       🙏 3   │  │       🙏 7   │  │       🙏 12  │
  └──────────────┘  └──────────────┘  └──────────────┘
```

</div>

---

## ✨ 기능

| | 기능 | 설명 |
|---|---|---|
| 📝 | **기도제목 작성** | 이름(또는 익명)과 함께 기도제목을 올릴 수 있어요 |
| 🎨 | **파스텔 카드** | 핑크, 옐로, 퍼플, 민트, 블루 중 원하는 색상을 골라요 |
| 🙏 | **함께 기도** | 기도 버튼을 눌러 "나도 함께 기도하고 있어요"를 표현해요 |
| ⚡ | **실시간 동기화** | Firestore 실시간 구독으로 새 기도제목이 바로 보여요 |

## 🛠 기술 스택

<div align="center">

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat-square&logo=firebase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

</div>

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 로컬 개발 서버
npm run dev
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하세요.

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run test` | 테스트 실행 |
| `npm run lint` | ESLint 점검 |
| `npm run deploy` | 빌드 + Firebase 배포 |

## 📦 배포

- **자동 배포** — `master` merge 시 GitHub Actions → Firebase Hosting
- **PR 프리뷰** — PR 생성 시 프리뷰 URL 자동 생성
- **테스트 필수** — PR의 lint, test, build가 모두 통과해야 merge 가능

---

<div align="center">

예배인교회 청년부 **In-Youth** 🤍

</div>
