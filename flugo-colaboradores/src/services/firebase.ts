import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const configuracaoFirebase = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(configuracaoFirebase);

export const db = getFirestore(app);