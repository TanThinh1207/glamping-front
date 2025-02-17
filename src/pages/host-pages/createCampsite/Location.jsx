import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Leaflet Marker Icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const defaultCenter = { lat: 10.7769, lng: 106.7009 }; // Ho Chi Minh City

const Location = () => {
  const [position, setPosition] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Fetch search suggestions from Nominatim API
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Handle address selection from search results
  const handleSelectAddress = async (place) => {
    setSearchQuery(place.display_name);
    setSearchResults([]);
    setPosition({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${place.lat}&lon=${place.lon}&format=json`
      );
      const data = await response.json();
      setAddress(data.display_name || "");
      setCity(data.address?.city || data.address?.town || "");
      setPostalCode(data.address?.postcode || "");
      setIsConfirmed(false);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  // Handle confirming the selected location
  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Where's your place located?</h2>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Enter your address"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="absolute bg-white border w-full max-h-40 overflow-auto 
               z-[1000] rounded-lg shadow-md mt-1">
            {searchResults.map((place) => (
              <li
                key={place.place_id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectAddress(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map with marker */}
      <MapContainer center={position} zoom={14} className="w-full h-[300px] rounded-lg mt-4">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>

      {/* Address Fields */}
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

      {/* Confirm Button */}
      {!isConfirmed && (
        <button
          onClick={handleConfirm}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Confirm Address
        </button>
      )}
    </div>
  );
};

export default Location;
