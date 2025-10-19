import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjFRgLhVoauzdrhAWZBdkCfQt_tYAaxqI",
  authDomain: "bonheur-b38a2.firebaseapp.com",
  databaseURL: "https://bonheur-b38a2-default-rtdb.firebaseio.com",
  projectId: "bonheur-b38a2",
  storageBucket: "bonheur-b38a2.appspot.com",
  messagingSenderId: "959568309575",
  appId: "1:959568309575:web:2eeb4b84d94f60fe9a3062",
  measurementId: "G-N2N0GCQC76",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
