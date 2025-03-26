import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCampsite } from '../../../context/CampsiteContext';

// Maptiler API key
const MAPTILER_KEY = "6PzV7JPUgWxephJUe1TH";

// Default coordinates for map
const INITIAL_COORDS = { lat: 10.7769, lng: 106.7009 };

// List of countries
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
  const { campsiteData, updateCampsiteData } = useCampsite();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [address, setAddress] = useState(campsiteData.address || "");
  const [city, setCity] = useState(campsiteData.city || "");
  const [lat, setLat] = useState(campsiteData.latitude || INITIAL_COORDS.lat);
  const [lng, setLng] = useState(campsiteData.longitude || INITIAL_COORDS.lng);

  // Update state
  useEffect(() => {
    setAddress(campsiteData.address || "");
    setCity(campsiteData.city || "");
    setLat(campsiteData.latitude || INITIAL_COORDS.lat);
    setLng(campsiteData.longitude || INITIAL_COORDS.lng);
  }, [campsiteData]);

  // Initialize map
  const mapContainer = useRef(null);
  
  useEffect(() => {
    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}`,
      center: [lng, lat],
      zoom: 10,
    });
    const newMarker = new maplibregl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(mapInstance);
    newMarker.on("dragend", () => {
      const lngLat = newMarker.getLngLat();
      setLat(lngLat.lat);
      setLng(lngLat.lng);
      reverseGeocode(lngLat.lat, lngLat.lng);
    });
    setMap(mapInstance);
    setMarker(newMarker);
    return () => mapInstance.remove();
  }, [lat, lng]);


  // Function to handle click for searching result
  const handleSelectLocation = (place) => {
    if (!place || !place.geometry || !place.geometry.coordinates) {
      console.error("Invalid place object:", place);
      return;
    }
    const [lng, lat] = place.geometry.coordinates;
    const streetName = place.text || "";
    const ward =
      place.context?.find((c) => c.id.includes("municipal_district"))?.text || "";
    const district =
      place.context?.find((c) => c.id.includes("municipality"))?.text || "";
    const city =
      place.context?.find((c) => c.id.includes("subregion"))?.text || "";

    const formattedAddress = [streetName, ward, district]
      .filter((part) => part)
      .join(", ");

      setLat(lat);
      setLng(lng);
      setAddress(formattedAddress);
      setCity(city);
      updateCampsiteData("latitude", lat);
      updateCampsiteData("longitude", lng);
      updateCampsiteData("address", formattedAddress);
      updateCampsiteData("city", city);
    if (marker) {
      marker.setLngLat([lng, lat]);
    }
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 16 });
    }
    setSearchResults([]);
    setSearchQuery("");
  };
  
  // Function to handle reverse geocode
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${MAPTILER_KEY}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.features.length > 0) {
        const place = data.features[0];
        const newAddress = place.properties.address || address;
        const newCity = place.properties.locality || city;
        setAddress(newAddress);
        setCity(newCity);
      }
    } catch (error) {
      console.error("Error fetching reverse geocode:", error);
    }
  };

  // Function to handle search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const countryCode = selectedCountry || "VN";
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}&country=${countryCode}`,
          { headers: { Accept: "application/json" } }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setSearchResults(data.features || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="w-full bg-white py-24 px-96">
      <div className='mb-8'>
        <h1 className="text-4xl font-semibold">Where's your campsite located?</h1>
        <h2 className=" text-gray-500">Your address is only shared with guests after they’ve made a reservation.</h2>
      </div>
      <div className="">
        <label className="block text-sm font-medium">Country/Region</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none mb-4"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded-md"
        />
        <ul>
          {searchResults.map((place, index) => {
            const streetName = place.text || "";
            const ward =
              place.context?.find((c) => c.id.includes("municipal_district"))?.text ||
              "";
            const district =
              place.context?.find((c) => c.id.includes("municipality"))?.text || "";
            const city =
              place.context?.find((c) => c.id.includes("subregion"))?.text || "";
            const displayName = [streetName, ward, district, city]
              .filter((part) => part)
              .join(", ");
            return (
              <li
                key={place.id || `location-${index}`}
                className="p-2 border hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  handleSelectLocation(place);
                }}
              >
                {displayName}
              </li>
            );
          })}
        </ul>
      </div>
      <div ref={mapContainer} className="w-full h-64 mt-4 border rounded-md" />
      <div className="mt-4">
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={campsiteData.address}
          onChange={(e) => {
            setAddress(e.target.value)
            updateCampsiteData('address', e.target.value)
          }}
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={campsiteData.city}
          onChange={(e) => {
            setCity(e.target.value)
            updateCampsiteData('city', e.target.value)
          }}
        />
      </div>
    </div>
  );
};

export default Location;
