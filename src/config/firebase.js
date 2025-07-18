import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDcIurjmC1e5p8qGAnRTc1pHt7jf6mPBXo",
  authDomain: "shoply-31172.firebaseapp.com",
  projectId: "shoply-31172",
  storageBucket: "shoply-31172.firebasestorage.app",
  messagingSenderId: "639649990686",
  appId: "1:639649990686:web:1a67c1336993104372860f",
  measurementId: "G-VG5XDHFG6D",
};

console.log("✅ Firebase configuration loaded successfully");

// Initialize Firebase
const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
const auth = getAuth(app);

// Ensure Auth is properly configured
console.log("🔧 Auth configuration:", {
  app: auth.app,
  projectId: auth.app.options.projectId,
  authDomain: auth.app.options.authDomain,
});
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

let analytics = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
    console.log("✅ Analytics initialized");
  } else {
    console.log("⚠️ Analytics not supported in this environment");
  }
});

export { app, auth, db, storage, functions, analytics };
export default app;
