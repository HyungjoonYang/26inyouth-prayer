import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app
let db
let prayersRef
let initError = null

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  prayersRef = collection(db, 'prayers')
} catch (err) {
  initError = err
  console.error('Firebase 초기화 실패:', err)
}

export function getInitError() {
  return initError
}

export function subscribeToPrayers(callback, onError) {
  if (initError) {
    onError?.(initError)
    return () => {}
  }
  const q = query(prayersRef, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      const prayers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(prayers)
    },
    (err) => {
      console.error('Firestore 구독 에러:', err)
      onError?.(err)
    },
  )
}

export async function addPrayer({ name, content, color }) {
  return addDoc(prayersRef, {
    name: name || '',
    content,
    color,
    prayCount: 0,
    createdAt: serverTimestamp(),
  })
}

export async function incrementPrayCount(docId) {
  const docRef = doc(db, 'prayers', docId)
  return updateDoc(docRef, {
    prayCount: increment(1),
  })
}
