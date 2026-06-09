import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgQzMBgTQV40GENQa2hpk8YPSBCKnOnmg",
  authDomain: "elite-hire-ecaeb.firebaseapp.com",
  projectId: "elite-hire-ecaeb",
  storageBucket: "elite-hire-ecaeb.firebasestorage.app",
  messagingSenderId: "1076663647063",
  appId: "1:1076663647063:web:9703d597fad97fa4871c12"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
