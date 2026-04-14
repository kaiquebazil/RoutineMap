import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8cx51Bk__xOIdQvIZ-cRmnioYlU_NKhY",
  authDomain: "routinemap-8a9ad.firebaseapp.com",
  projectId: "routinemap-8a9ad",
  storageBucket: "routinemap-8a9ad.firebasestorage.app",
  messagingSenderId: "1093998360031",
  appId: "1:1093998360031:web:cc948e62c3bc5ddc47806a",
  measurementId: "G-DT972D0H3G",
};

// Initialize Firebase (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Analytics - only available in the browser
let analytics: Analytics | null = null;

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;

  const supported = await isSupported();
  if (supported) {
    analytics = getAnalytics(app);
  }
  return analytics;
};

export { app };
