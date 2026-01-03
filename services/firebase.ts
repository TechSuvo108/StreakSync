import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFCA_6WLb-VU9m5VEJqS4fqDK-wft7_6E",
  authDomain: "streaksync-ad98a.firebaseapp.com",
  projectId: "streaksync-ad98a",
  storageBucket: "streaksync-ad98a.firebasestorage.app",
  messagingSenderId: "344684057610",
  appId: "1:344684057610:web:e2a76348b62259715dbbf3",
  measurementId: "G-R8CZ29FYTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
