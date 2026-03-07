import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVZS38TMBThLKLXP9tzOkLGN7mU4RdTdc",
  authDomain: "prayer-app-dev-e92b7.firebaseapp.com",
  projectId: "prayer-app-dev-e92b7",
  storageBucket: "prayer-app-dev-e92b7.firebasestorage.app",
  messagingSenderId: "490648255717",
  appId: "1:490648255717:web:a50210d32449abc4dd280c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);