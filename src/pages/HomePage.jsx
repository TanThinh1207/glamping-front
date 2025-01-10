import React, { useState } from "react";
import thumb from "../assets/thumb.jpg"

const HomePage = () => {
  const [dropdowns, setDropdowns] = useState({
    destinations: false,
    glampingTypes: false,
    settings: false,
  });
  const [selectedValues, setSelectedValues] = useState({
    destinations: "Destinations",
    glampingTypes: "Glamping Types",
    settings: "Settings",
  });
  const dropdownData = {
    destinations: ["USA", "Canada", "Europe", "Australia"],
    glampingTypes: ["Tents", "Cabins", "Treehouses", "Villas"],
    settings: ["Beach", "City", "Countryside"],
  };
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleSelect = (key, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setDropdowns((prev) => ({
      ...prev,
      [key]: false, 
    }));
  };

  return (
    <div>
      <div className="flex relative justify-center w-full">
        <img
          src={thumb}
          className="w-full h-auto"
        />
      </div>
      <div className="flex justify-center space-x-4 mt-6 px-6 relative">
        <div className="relative">
          <div
            onClick={() => toggleDropdown("destinations")}
            className="flex items-center justify-between border border-black w-48 h-12 px-4 bg-gradient-to-t from-gray-200 to-white cursor-pointer"
          >
            <span className="font-montserrat uppercase text-sm">
              {selectedValues.destinations}
            </span>
            <span className="text-red-500 text-lg">▼</span>
          </div>
          {dropdowns.destinations && (
            <ul className="absolute top-full left-0 w-48 bg-white border border-black mt-1 shadow-md z-10">
              {dropdownData.destinations.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect("destinations", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <div
            onClick={() => toggleDropdown("glampingTypes")}
            className="flex items-center justify-between border border-black w-48 h-12 px-4 bg-gradient-to-t from-gray-200 to-white cursor-pointer"
          >
            <span className="font-montserrat uppercase text-sm">
              {selectedValues.glampingTypes}
            </span>
            <span className="text-red-500 text-lg">▼</span>
          </div>
          {dropdowns.glampingTypes && (
            <ul className="absolute top-full left-0 w-48 bg-white border border-black mt-1 shadow-md z-10">
              {dropdownData.glampingTypes.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect("glampingTypes", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <div
            onClick={() => toggleDropdown("settings")}
            className="flex items-center justify-between border border-black w-48 h-12 px-4 bg-gradient-to-t from-gray-200 to-white cursor-pointer"
          >
            <span className="font-montserrat uppercase text-sm">
              {selectedValues.settings}
            </span>
            <span className="text-red-500 text-lg">▼</span>
          </div>
          {dropdowns.settings && (
            <ul className="absolute top-full left-0 w-48 bg-white border border-black mt-1 shadow-md z-10">
              {dropdownData.settings.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect("settings", item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="bg-black text-white uppercase font-montserrat w-48 h-12 border border-black hover:bg-gray-800">
          Go Glamping
        </button>
      </div>
      <div className="text-center mt-12">
        <h2 className="font-montserrat text-2xl uppercase tracking-wide">
          Featured Properties
        </h2>
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
