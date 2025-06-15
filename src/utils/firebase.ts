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

const app       = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

if (window.location.hostname === "localhost") {
  connectStorageEmulator(storage, "localhost", 9199);
  connectAuthEmulator(auth, "http://localhost:9198");
  connectFirestoreEmulator(db, "localhost", 8082);
}