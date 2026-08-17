import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA63e9p6seqFC02Dr1MHNompBklChvNzlE',
  authDomain: 'kubrasoysal-3879b.firebaseapp.com',
  projectId: 'kubrasoysal-3879b',
  storageBucket: 'kubrasoysal-3879b.firebasestorage.app',
  messagingSenderId: '986254082902',
  appId: '1:986254082902:web:e8ab378fb108c9ff79ccf7',
  measurementId: 'G-V84QY1ZEYB'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
