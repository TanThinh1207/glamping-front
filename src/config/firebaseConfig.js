import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBT07TWFz40eFvCuaHcLkx5XHN0XEIK94g",
    authDomain: "glamping-450314.firebaseapp.com",
    projectId: "glamping-450314",
    storageBucket: "glamping-450314.firebasestorage.app",
    messagingSenderId: "216718482095",
    appId: "1:216718482095:web:c6b19c46d2c64bbafed25a",
    measurementId: "G-S31Q3K13JG",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export { auth, provider };
