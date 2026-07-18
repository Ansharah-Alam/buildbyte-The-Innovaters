import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5WnTb4Xu1mRbXEUghLAiqt6RGrqR4gzY",
  authDomain: "studysquad-74c08.firebaseapp.com",
  projectId: "studysquad-74c08",
  storageBucket: "studysquad-74c08.firebasestorage.app",
  messagingSenderId: "149491930796",
  appId: "1:149491930796:web:b265332b62effb75a73109"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);