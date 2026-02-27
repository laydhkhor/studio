'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** 
 * Initiate anonymous sign-in. 
 * Returns the promise so callers can handle errors, 
 * but success should still be handled via onAuthStateChanged.
 */
export function initiateAnonymousSignIn(authInstance: Auth) {
  return signInAnonymously(authInstance);
}

/** 
 * Initiate email/password sign-up.
 * Returns the promise so callers can handle errors.
 */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string) {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** 
 * Initiate email/password sign-in.
 * Returns the promise so callers can handle errors.
 */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string) {
  return signInWithEmailAndPassword(authInstance, email, password);
}
