// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-9752766556-ba34f",
  "appId": "1:311216869920:web:eba73040a1ba69882da245",
  "storageBucket": "studio-9752766556-ba34f.firebasestorage.app",
  "apiKey": "AIzaSyCCjU_9RhsccnUwNN2FnwH7OLt2O22T7bU",
  "authDomain": "studio-9752766556-ba34f.firebaseapp.com",
  "databaseURL": "https://studio-9752766556-ba34f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
