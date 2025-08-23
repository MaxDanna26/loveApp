// services/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {

  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export {
  collection, doc, addDoc, getDoc, setDoc, getDocs, query,
  updateDoc, deleteDoc, where, onSnapshot, documentId
} from 'firebase/firestore';
export {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail,
  fetchSignInMethodsForEmail, sendEmailVerification
} from 'firebase/auth';
export { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

// ───────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: `${import.meta.env.VITE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_PROJECT_ID}.appspot.com`,
};

const app = initializeApp(firebaseConfig);

// Firestore con caché persistente (offline) y soporte multi-tab.
// Así, si la red cae , la app no peta.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  // problemas de streaming:
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Auth + persistencia en localStorage
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const storage = getStorage(app);
