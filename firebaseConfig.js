import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDswSWoS_bi_5qGWQHekRGG1VzAyy_ho5s",
  authDomain: "bounty-streak-59f86.firebaseapp.com",
  projectId: "bounty-streak-59f86",
  storageBucket: "bounty-streak-59f86.firebasestorage.app",
  messagingSenderId: "888983731303",
  appId: "1:888983731303:web:b3d41d2008171d1fa9e8c2",
  measurementId: "G-78EP3K988E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app); doesnt work idk why

// TEST
const db = getFirestore();
const userRefs = collection(db, "User");
