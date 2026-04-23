'use client'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAymJCA0pd38MOzy2Y683JBscLlwJBEqUM",
  authDomain: "smart-irrigation-pfe-a52f7.firebaseapp.com",
  projectId: "smart-irrigation-pfe-a52f7",
  storageBucket: "smart-irrigation-pfe-a52f7.firebasestorage.app",
  messagingSenderId: "911711078083",
  appId: "1:911711078083:web:46db3898abec0675ee4476",
  measurementId: "G-DCG1PGC1VD"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
