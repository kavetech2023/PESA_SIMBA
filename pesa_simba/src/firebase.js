import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCaAELuL5HlJilB3204OM-_bMsOrlWqpU",
  authDomain: "vote-513aa.firebaseapp.com",
  projectId: "vote-513aa",
  storageBucket: "vote-513aa.firebasestorage.app",
  messagingSenderId: "614787106563",
  appId: "1:614787106563:web:0e361b5d14da5b340d4b36",
  measurementId: "G-HV3D5SF5Z5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);