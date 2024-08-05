// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhqjzxY5o6SqDFKnUCs_5BvR4a4OkGsu0",
  authDomain: "inventory-management-41990.firebaseapp.com",
  projectId: "inventory-management-41990",
  storageBucket: "inventory-management-41990.appspot.com",
  messagingSenderId: "1069868977575",
  appId: "1:1069868977575:web:9b0c9cb4b71543e5e3ba82",
  measurementId: "G-E2H3EZMHXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}