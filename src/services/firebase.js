import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5USnzbA7DTKhrYFgoJCY3JmehNvV3AgA",
  authDomain: "queuems-c36b5.firebaseapp.com",
  projectId: "queuems-c36b5",
  storageBucket: "queuems-c36b5.firebasestorage.app",
  messagingSenderId: "645222823737",
  appId: "1:645222823737:web:27ae48ba8b7f2a7ae19ae8",
  measurementId: "G-GF15JZXRHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };