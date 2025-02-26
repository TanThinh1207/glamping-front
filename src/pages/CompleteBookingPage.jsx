import React from "react";
import { useNavigate } from "react-router-dom";

const CompleteBookingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="p-8 max-w-lg">
        <h1 className="text-5xl font-semibold">Thank you!</h1>
        <p className="text-2xl font-canto font-semibold uppercase mt-4">for booking with us</p>
        <p className="text-gray-600 my-4">
          Your glamping adventure with <span className="font-semibold">AstroGlampé</span> is confirmed.
          We look forward to hosting you!
        </p>

        <button
          className="bg-black text-white text-xs w-full border-black border uppercase my-2 p-4 transform duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black mr-2"
          onClick={() => navigate("/")}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default CompleteBookingPage;
