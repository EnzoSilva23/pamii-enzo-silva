import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA5dYNJYLZhVGpvr14BzFOvZCCKVxYJNns",
    authDomain: "atividade04-05-26.firebaseapp.com",
    projectId: "atividade04-05-26",
    storageBucket: "atividade04-05-26.firebasestorage.app",
    messagingSenderId: "987144582071",
    appId: "1:987144582071:web:118b5f2ffa2023f83f6e32"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);