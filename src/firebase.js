import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
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

export function subscribeToPrayers(callback, onError) {
  const q = query(prayersRef, orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const prayers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(prayers)
  }, (error) => {
    console.error('Failed to subscribe to prayers:', error)
    if (onError) onError(error)
  })
}

export async function addPrayer({ name, content, color, deviceId }) {
  return addDoc(prayersRef, {
    name: name || '',
    content,
    color,
    deviceId: deviceId || '',
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

export async function updatePrayer(docId, { name, content, color }) {
  const docRef = doc(db, 'prayers', docId)
  return updateDoc(docRef, {
    name: name || '',
    content,
    color,
  })
}

export async function deletePrayer(docId) {
  const docRef = doc(db, 'prayers', docId)
  return deleteDoc(docRef)
}
