import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC8_852-LSXLaDkGA-wPjm2P3oRe7-om98",
    authDomain: "tarefas-f43e9.firebaseapp.com",
    projectId: "tarefas-f43e9",
    storageBucket: "tarefas-f43e9.appspot.com",
    messagingSenderId: "711496731037",
    appId: "1:711496731037:web:637e4f68687e24ad194774",
    measurementId: "G-DS18DZ73HZ"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {db, auth};