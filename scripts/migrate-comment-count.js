/**
 * 마이그레이션: 기존 prayer 문서에 commentCount 필드 채우기
 *
 * 사용법: node scripts/migrate-comment-count.js
 *
 * .env 파일의 VITE_FIREBASE_* 값을 읽어 Firestore에 접근합니다.
 */

import { readFileSync } from 'fs'
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'

// .env 파일에서 VITE_FIREBASE_* 환경변수 파싱
const envContent = readFileSync(new URL('../.env', import.meta.url), 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^(\w+)=(.*)$/)
  if (match) env[match[1]] = match[2].trim()
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migrate() {
  const prayersSnap = await getDocs(collection(db, 'prayers'))
  console.log(`Found ${prayersSnap.size} prayers`)

  let updated = 0
  for (const prayerDoc of prayersSnap.docs) {
    const commentsSnap = await getDocs(
      collection(db, 'prayers', prayerDoc.id, 'comments')
    )
    const count = commentsSnap.size

    const current = prayerDoc.data().commentCount
    if (current !== count) {
      await updateDoc(doc(db, 'prayers', prayerDoc.id), { commentCount: count })
      console.log(`  ${prayerDoc.id}: ${current ?? 'undefined'} → ${count}`)
      updated++
    }
  }

  console.log(`Done. Updated ${updated} / ${prayersSnap.size} documents.`)
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
