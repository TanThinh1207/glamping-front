import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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

const LoginPage = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch("http://localhost:8080/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok) {
        localStorage.setItem("accessToken", data.data.accessToken);
        console.log("User authenticated:", data.data);
        alert("Login successful!");
      } else {
        throw new Error(data.message || "Authentication failed!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="container">
        <div className="title pt-12 flex justify-center">
          <h1 className="text-3xl font-thin italic">MY COIFFURE ACCOUNT</h1>
        </div>
        <div className="form-container px-48 pt-10 pb-10">
          <div className="login-form lg:bg-gray-50 py-20 flex justify-center">
            <div className="form-section w-96">
              <button
                onClick={handleLogin}
                className="text-white uppercase font-montserrat bg-black w-full py-3 hover:bg-transparent
                          hover:text-black transform duration-300 border border-black mt-3 flex items-center justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                  alt="Google logo"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="content">
          <div className="title flex justify-center text-xl font-montserrat pt-10 pb-10 font-semibold">
            JOIN ASTROGLAMPÉ
          </div>
          <div className="details flex pb-16">
            <div className="left-container w-1/2 flex flex-col text-center items-center">
              <p className="uppercase">streamline checkout</p>
              <p className="w-1/2 pt-4 font-thin">
                Check out faster with saved addresses and payment methods.
              </p>
            </div>
            <div className="right-container w-1/2 flex flex-col text-center items-center">
              <p className="uppercase">book a trip</p>
              <p className="w-1/2 pt-4 font-thin">
                Enjoy priority access to the boutique of your choice at the time
                and date that suits you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
