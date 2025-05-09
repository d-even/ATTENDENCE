// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   setPersistence,
//   browserLocalPersistence,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword
// } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// const firebase = {
//   apiKey: "AIzaSyCZtf7JbPQWraaFUEuEOiV-Ylzh-ZLryxk",
//   authDomain: "hello-c5cf1.firebaseapp.com",
//   projectId: "hello-c5cf1",
//   storageBucket: "hello-c5cf1.firebasestorage.app",
//   messagingSenderId: "437173007169",
//   appId: "1:437173007169:web:ec1932d0342702800fa7c0",
//   measurementId: "G-2FJ33DH8XX",
// };

// const app = initializeApp(firebase);
// const auth = getAuth(app);

// // ✅ Make login persistent even after refresh or tab close
// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log("✅ Session persistence set (browserLocalPersistence)");
//   })
//   .catch((error) => {
//     console.error("❌ Error setting persistence:", error);
//   });

// const database = getDatabase(app);
// const db = getFirestore(app);

// export {
//   auth,
//   database,
//   db,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   doc,
//   setDoc,
//   getDoc
// };







import { initializeApp } from "firebase/app";
import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


const firebase = {
    apiKey: "AIzaSyCZtf7JbPQWraaFUEuEOiV-Ylzh-ZLryxk",
    authDomain: "hello-c5cf1.firebaseapp.com",
    projectId: "hello-c5cf1",
    storageBucket: "hello-c5cf1.firebasestorage.app",
    messagingSenderId: "437173007169",
    appId: "1:437173007169:web:ec1932d0342702800fa7c0",
    measurementId: "G-2FJ33DH8XX",
  };

// Initialize Firebase
const app = initializeApp(firebase);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);

export { auth, database,db, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc, getDoc };