# 인유스 기도함

교회 청년부(인유스)가 서로의 기도제목을 나누고, 함께 기도할 수 있는 웹앱.

**https://inyouth-prayer.web.app**

## 기술 스택

- **프론트엔드**: React 19 + Vite + Tailwind CSS v4
- **백엔드**: Firebase Firestore (실시간 구독)
- **배포**: Firebase Hosting + GitHub Actions CI/CD

## 로컬 개발

```bash
npm install
npm run dev
```

### 환경 변수

`.env` 파일을 프로젝트 루트에 생성:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 배포

- **자동 배포**: master 브랜치에 merge 시 GitHub Actions가 Firebase Hosting에 배포
- **PR 프리뷰**: PR 생성 시 프리뷰 URL 자동 생성
- **수동 배포**: `npm run deploy`
