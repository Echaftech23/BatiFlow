import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';

import { getGoogleSignInConfig } from '@/services/config/env';
import { getFirebaseAuth } from '@/services/firebase/firebaseAuth';

let configured = false;
let warnedUnavailable = false;

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

function getGoogleSigninModule(): GoogleSigninModule | null {
  // Expo Go does not include the RNGoogleSignin native module.
  if (Constants.executionEnvironment === 'storeClient') {
    return null;
  }
  try {
    // Lazy-load to avoid crashing Expo Go at module import time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@react-native-google-signin/google-signin') as GoogleSigninModule;
  } catch {
    if (!warnedUnavailable) {
      warnedUnavailable = true;
      console.warn('Google Sign-In unavailable in this runtime.');
    }
    return null;
  }
}

export function configureGoogleSignIn() {
  if (configured) return;
  const googleModule = getGoogleSigninModule();
  if (!googleModule) return;
  const { webClientId, iosClientId } = getGoogleSignInConfig();
  googleModule.GoogleSignin.configure({
    webClientId,
    iosClientId,
  });
  configured = true;
}

export async function signInWithGoogle() {
  const googleModule = getGoogleSigninModule();
  if (!googleModule) {
    throw new Error('Google Sign-In n’est pas disponible dans cette build.');
  }
  configureGoogleSignIn();
  await googleModule.GoogleSignin.hasPlayServices();
  const response = await googleModule.GoogleSignin.signIn();

  if (!googleModule.isSuccessResponse(response)) {
    throw new Error('Connexion Google annulée.');
  }

  const idToken = response.data.idToken;
  if (!idToken) {
    throw new Error('Token Google manquant.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(getFirebaseAuth(), credential);
}

export async function signOutGoogle() {
  const googleModule = getGoogleSigninModule();
  if (!googleModule) return;
  try {
    await googleModule.GoogleSignin.signOut();
  } catch (error) {
    if (
      (error as { code?: string }).code !==
      googleModule.statusCodes.SIGN_IN_REQUIRED
    ) {
      throw error;
    }
  }
}
