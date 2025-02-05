import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "group5-capstone-project.firebaseapp.com",
  projectId: "group5-capstone-project",
  storageBucket: "group5-capstone-project.firebasestorage.app",
  messagingSenderId: "53778726797",
  appId: "1:53778726797:web:9e285ea6cb93cc343d07c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
