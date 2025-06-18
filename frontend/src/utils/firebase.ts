import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBdT-YGRwaDm97WjQULiGAgpYVNxhgtSSI",
  authDomain: "puustidatabase.firebaseapp.com",
  projectId: "puustidatabase",
  storageBucket: "puustidatabase.firebasestorage.app",
  messagingSenderId: "1074091296532",
  appId: "1:1074091296532:web:b1bb5fe8aab42efbdba401",
  measurementId: "G-HM73V50956"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
if (window.location.hostname !== "your-production.com") {
  connectAuthEmulator(auth, "http://localhost:9198");
}
export const db = getFirestore(app);
if (window.location.hostname !== "your-production.com") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
export const storage = getStorage(app)

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9198");
}