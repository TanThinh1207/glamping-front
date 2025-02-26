import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl font-semibold">AstroGlampé</h2>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400">About</a>
            <a href="#" className="hover:text-gray-400">Destinations</a>
            <a href="#" className="hover:text-gray-400">Contact</a>
            <a href="#" className="hover:text-gray-400">Terms</a>
          </nav>
        </div>
        <div className="text-center text-gray-500 mt-6 text-sm">
          © {new Date().getFullYear()} AstroGlampé. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
