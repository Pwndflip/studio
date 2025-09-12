'use client';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: 'studio-9752766556-ba34f',
  appId: '1:311216869920:web:eba73040a1ba69882da245',
  storageBucket: 'studio-9752766556-ba34f.firebasestorage.app',
  apiKey: 'AIzaSyCCjU_9RhsccnUwNN2FnwH7OLt2O22T7bU',
  authDomain: 'studio-9752766556-ba34f.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '311216869920',
  databaseURL: 'https://studio-9752766556-ba34f-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
