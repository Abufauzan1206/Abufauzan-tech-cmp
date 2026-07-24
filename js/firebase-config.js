// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGpFbKYvGT4TSbeijyx-6Il1N8Mw4uvKE",
  authDomain: "abufauzan-tech-cmp.firebaseapp.com",
  projectId: "abufauzan-tech-cmp",
  storageBucket: "abufauzan-tech-cmp.firebasestorage.app",
  messagingSenderId: "552737291915",
  appId: "1:552737291915:web:637fd597f5949dd48f1e8e",
  measurementId: "G-9CM038CCEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);