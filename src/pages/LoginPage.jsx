import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebaseConfig";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

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
      console.log("Login Response:", data);

      if (response.ok) {
        localStorage.setItem("accessToken", data.data.accessToken);
        login(data.data.user)
        toast.success("Login successful!");
      } else {
        toast.error("Login error code: " + data.statusCode)
        throw new Error(data.message || "Authentication failed!");
      }
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="container">
        <div className="title pt-12 flex justify-center">
          <h1 className="text-3xl font-thin italic">MY ASTROGLAMPÉ ACCOUNT</h1>
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
