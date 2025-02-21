import React from 'react'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
  provider.setCustomParameters({ prompt: 'select_account' });
const LoginButton = () => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            console.log("ID Token gửi lên Backend:", idToken); // Kiểm tra token

            // const response = await fetch("http://localhost:8080/api/v1/auth/verify", {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({idToken})
            // });

            // const data = await response.json();
            // console.log("Backend Response:", data);

            // if (!response.ok) {
            //     throw new Error(data.error || "Lỗi xác thực!");
            // }

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert(error.message);
        }
    };
  return (
    <div>
           <button
      onClick={handleLogin}
      className="px-6 py-2 font-semibold rounded-lg border-2 border-black"
    >
        Login
    </button>
        </div>
  )
}

export default LoginButton