import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

// Initialize Firebase SDK
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured databaseId
export const db = getFirestore(
  firebaseApp,
  firebaseConfigData.firestoreDatabaseId || '(default)'
);

// Initialize Authentication
export const auth = getAuth(firebaseApp);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
