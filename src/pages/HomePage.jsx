import React, { useState } from "react";
import thumb from "../assets/thumb.jpg"

const HomePage = () => {
  return (
    <div>
      <div className="flex relative justify-center w-full">
        <img
          src={thumb}
          className="w-full h-auto"
        />
      </div>
      <div className="flex relative justify-center w-full">
        <img
          src={thumb}
          className="w-full h-auto"
        />
      </div>
      <div className="flex relative justify-center w-full">
        <img
          src={thumb}
          className="w-full h-auto"
        />
      </div>
      <div className="flex relative justify-center w-full">
        <img
          src={thumb}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default HomePage;
