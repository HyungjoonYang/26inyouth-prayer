# 26청년부 기도함

교회 청년부가 서로의 기도제목을 나누고, 함께 기도할 수 있는 웹앱.

## 셋업

```bash
npm install
```

### Firebase 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Firestore Database 활성화 (테스트 모드)
3. 프로젝트 설정 > 일반 > 웹 앱 추가 > Firebase SDK config 복사
4. `.env` 파일 생성:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 개발

```bash
npm run dev
```

## 배포

```bash
npm install -g firebase-tools
firebase login
firebase init hosting  # public: dist, SPA: yes
npm run deploy
```
