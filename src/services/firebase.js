import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB78sisIN9IflrR6PUF54ARkW4dfOiNTfg",
  authDomain: "queue-20ba8.firebaseapp.com",
  projectId: "queue-20ba8",
  storageBucket: "queue-20ba8.firebasestorage.app",
  messagingSenderId: "54762668551",
  appId: "1:54762668551:web:bb6a148a41c7e48a6e20a2",
  measurementId: "G-QVKCHPNQ1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };