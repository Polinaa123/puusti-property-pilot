import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);