import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjfgaFsWkDNFujrLEtm8fdazvRruh6Mg4",
  authDomain: "bookshelf-7cda0.firebaseapp.com",
  projectId: "bookshelf-7cda0",
  storageBucket: "bookshelf-7cda0.appspot.com",
  messagingSenderId: "598885760682",
  appId: "1:598885760682:web:f04a5450582b8d6c6e9ad3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
