import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsAibJFZjGSmpJb-nVDRo5Tr2blsQIq5o",
  authDomain: "tarefas-8987b.firebaseapp.com",
  projectId: "tarefas-8987b",
  storageBucket: "tarefas-8987b.appspot.com",
  messagingSenderId: "248295477021",
  appId: "1:248295477021:web:4bfa38aecd02f5e3639bf4",
  measurementId: "G-481Z4KZ6N4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); 
const auth = getAuth(app); 
export { db, auth };
