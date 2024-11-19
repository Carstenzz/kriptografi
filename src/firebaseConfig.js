// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ7pSVk6ASHIs-aSs0r6WXyHj_n7yb8KM",
  authDomain: "kriptografi-66607.firebaseapp.com",
  projectId: "kriptografi-66607",
  storageBucket: "kriptografi-66607.firebasestorage.app",
  messagingSenderId: "1071106023649",
  appId: "1:1071106023649:web:8ed39e0f4f4a71a5d5d7a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);