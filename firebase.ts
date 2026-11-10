// src/services/firebase.ts
// Firebase initialization. Fill in your own project's config below.
// Pata config hii kwenye Firebase Console -> Project Settings -> Your apps -> SDK setup and configuration

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "xtom-wifi-maps.firebaseapp.com",
  projectId: "xtom-wifi-maps",
  storageBucket: "xtom-wifi-maps.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

/** Hakikisha mtumiaji ana session (anonymous ikiwa hajaingia). */
export function ensureAuth(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user))
          .catch(reject);
      }
    });
  });
}
