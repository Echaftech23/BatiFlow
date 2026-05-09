import { getApp, getApps, initializeApp } from 'firebase/app';

import { getFirebaseConfig } from '@/services/config/env';

export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(getFirebaseConfig());
}
