// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCjU_9RhsccnUwNN2FnwH7OLt2O22T7bU",
  authDomain: "studio-9752766556-ba34f.firebaseapp.com",
  databaseURL: "https://studio-9752766556-ba34f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studio-9752766556-ba34f",
  storageBucket: "studio-9752766556-ba34f.firebasestorage.app",
  messagingSenderId: "311216869920",
  appId: "1:311216869920:web:eba73040a1ba69882da245"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
