// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFsJoBSe0ceYsjxprEC9Eb_YrEewpEj5U",
  authDomain: "portfolio-web-41160.firebaseapp.com",
  projectId: "portfolio-web-41160",
  storageBucket: "portfolio-web-41160.firebasestorage.app",
  messagingSenderId: "596055134849",
  appId: "1:596055134849:web:c7abd91ec15c837abdf380",
  measurementId: "G-GN4DJVDRG4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);