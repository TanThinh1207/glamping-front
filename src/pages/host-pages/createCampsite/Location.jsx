import React, { useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const countries = [
  { label: "Vietnam - VN", code: "VN" },
  { label: "United States - US", code: "US" },
  { label: "United Kingdom - GB", code: "GB" },
  { label: "Canada - CA", code: "CA" },
  { label: "Australia - AU", code: "AU" },
  { label: "Wallis & Futuna - WF", code: "WF" },
  { label: "Japan - JP", code: "JP" },
  { label: "France - FR", code: "FR" },
];
const Location = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("VN");
  return (
    <div className=" bg-white w-full py-24 px-96">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Where's your place located?</h1>
        <h2 className=" text-gray-500">Your address is only shared with guests after they’ve made a reservation.</h2>
      </div>
      <div>
        <div className="relative">
          <select
            label="Country/Region"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium">Street Address</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isConfirmed}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!isConfirmed}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium">Postal Code</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            disabled={!isConfirmed}
          />
        </div>
      </div>
    </div>
  );
};

export default Location;
