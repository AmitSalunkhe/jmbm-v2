import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let db;
let auth;
let storage;
let googleProvider;

try {
    if (!firebaseConfig.apiKey) {
        throw new Error("Missing Firebase Configuration. Please check your .env file.");
    }
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    // Mock objects to prevent app crash on load
    db = {};
    auth = {};
    storage = {};
    googleProvider = {};
}

export { db, auth, storage, googleProvider, setPersistence, browserLocalPersistence };
