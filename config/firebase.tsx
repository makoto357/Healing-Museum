import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAmDUX1Xz-twveGC38wKyW2dkC_0nbqc0",
  authDomain: "healingmusuem.firebaseapp.com",
  projectId: "healingmusuem",
  storageBucket: "healingmusuem.appspot.com",
  messagingSenderId: "421968087530",
  appId: "1:421968087530:web:c5aafd0079f718db2a0a93",
  measurementId: "G-ZZ10KSQBVX",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
