import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCampsite } from "../../../context/CampsiteContext";
import axios from "axios";

const MAPTILER_KEY = "6PzV7JPUgWxephJUe1TH";
const INITIAL_COORDS = { lat: 10.7769, lng: 106.7009 };
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

const EditLocation = () => {
  const { id } = useParams();
  const { campsite, fetchCampsiteDetails } = useCampsite();
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(Number(campsite.latitude) || INITIAL_COORDS.lat);
  const [longitude, setLongitude] = useState(Number(campsite.longitude) || INITIAL_COORDS.lng);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (campsite) {
      setCity(campsite.city || "");
      setAddress(campsite.address || "");
      setLatitude(Number(campsite.latitude) || INITIAL_COORDS.lat);
      setLongitude(Number(campsite.longitude) || INITIAL_COORDS.lng);
    }
    console.log(latitude, longitude);
  }, [campsite]);

  useEffect(() => {
    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}`,
      center: [Number(longitude), Number(latitude)],
      zoom: 10,
    });
    const newMarker = new maplibregl.Marker({ draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(mapInstance);
    newMarker.on("dragend", () => {
      const lngLat = newMarker.getLngLat();
      setLatitude(Number(lngLat.lat));
      setLongitude(Number(lngLat.lng));
      reverseGeocode(lngLat.lat, lngLat.lng);
    });
    setMap(mapInstance);
    setMarker(newMarker);
    return () => mapInstance.remove();
  }, [latitude, longitude]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const countryCode = selectedCountry || "VN";
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_KEY}&country=${countryCode}`
        );
        if (!response.ok) throw new Error("Failed to fetch location data");
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

    setLatitude(Number(lat));
    setLongitude(Number(lng));
    setAddress(formattedAddress);
    setCity(city);
    setHasChanges(true);

    if (marker) {
      marker.setLngLat([lng, lat]);
    }
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 16 });
    }
    setSearchResults([]);
    setSearchQuery("");
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`
      );
      if (!response.ok) throw new Error("Failed to reverse geocode");
      const data = await response.json();
      if (data.features.length > 0) {
        const place = data.features[0];
        const newAddress = place.properties.address || address;
        const newCity = place.properties.locality || city;
        setAddress(newAddress);
        setCity(newCity);
        setHasChanges(true);
      }
    } catch (error) {
      console.error("Error fetching reverse geocode:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving changes:", { city, address, latitude, longitude });
      await axios.patch(`${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`, {
        city: city,
        address: address,
        latitude: latitude,
        longitude: longitude,
      });
      fetchCampsiteDetails();
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="min-h-screen px-44 pb-20 relative">
      <h1 className="text-3xl font-semibold mb-4">Edit Campsite Location</h1>
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
      <input
        type="text"
        placeholder="Search location"
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
      <div ref={mapContainer} className="w-full h-64 mt-4 border rounded-md" />
      <div className="mt-4">
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setHasChanges(true);
          }}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setHasChanges(true);
          }}
          className="w-full p-2 border rounded-md"
        />
      </div>
      {hasChanges && (
        <div className='fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end z-50'>
          <button className='bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300 px-6 py-2 rounded-lg'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditLocation;
