// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjHy0u9SmML140uXQUCLv944Mpm498J5g",
  authDomain: "linkedin-clone-3dccb.firebaseapp.com",
  projectId: "linkedin-clone-3dccb",
  storageBucket: "linkedin-clone-3dccb.appspot.com",
  messagingSenderId: "424920140635",
  appId: "1:424920140635:web:c9d41c82b3eb53d2c7287e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

export { auth, storage, db };