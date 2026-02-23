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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const prayersRef = collection(db, 'prayers')

export function subscribeToPrayers(callback) {
  const q = query(prayersRef, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const prayers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(prayers)
  })
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
