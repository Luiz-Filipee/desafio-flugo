import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();
  localStorage.setItem('token', token);

  return userCredential.user;
}

export function logout() {
  localStorage.removeItem('token');
  signOut(auth);
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
