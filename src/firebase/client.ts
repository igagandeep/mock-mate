// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
l
const firebaseConfig = {
  apiKey: "AIzaSyC6H74KrfGsWJrCAp0YGvsL6NZOHO2lCRw",
  authDomain: "mockmate-43324.firebaseapp.com",
  projectId: "mockmate-43324",
  storageBucket: "mockmate-43324.firebasestorage.app",
  messagingSenderId: "641995695627",
  appId: "1:641995695627:web:9ed4499f0fdb3fbc24c90e",
  measurementId: "G-DKRDY95QJ6"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);