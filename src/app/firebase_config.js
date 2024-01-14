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
  apiKey: "AIzaSyACuRRc12balok7v-XTxjUy3DhCdoflIY4",
  authDomain: "wm-conejo-el-patio.firebaseapp.com",
  projectId: "wm-conejo-el-patio",
  storageBucket: "wm-conejo-el-patio.appspot.com",
  messagingSenderId: "59386056237",
  appId: "1:59386056237:web:5686e9df9c43ce50cbf2a4",
  measurementId: "G-NSC9C6RRZN"
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

