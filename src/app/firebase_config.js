/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Enable experimentalForceLongPolling for Firestore
export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false, 
});

const analytics = getAnalytics(app);

export const firestoreDB = getFirestore(app);
export const auth = getAuth(app);

