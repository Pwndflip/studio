'use client';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// =================================================================================
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
// =================================================================================
// 1. Go to the Firebase console for your project.
// 2. In Project settings > General, find your web app.
// 3. Copy the firebaseConfig object and paste it below.
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
