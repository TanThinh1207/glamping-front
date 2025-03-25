import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { fetchCampsiteCityList } from "../service/BookingService";
import { toast } from "sonner";

const DestinationSearch = () => {
    const navigate = useNavigate(); // ✅ Initialize useNavigate()
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const dropdownRef = useRef(null);

    // Fetch destinations from API
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await fetchCampsiteCityList();
                setDestinations(data);
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };
        fetchDestinations();
    }, []);

    // Filter destinations based on search input
    const filteredDestinations = destinations.filter((destination) =>
        destination.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        navigate("/campsite", { state: { selectedCity: selectedDestination || null } });
        setSearchTerm("");
        setDropdownOpen(false);
    };

    return (
        <div className="w-full mx-auto mt-2 p-6 bg-white shadow-lg rounded-xl flex gap-6 items-center">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
                Where do you want to go glamping?
            </h2>

            <div className="relative w-full" ref={dropdownRef}>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <span className="px-3 py-2 bg-gray-100 border-r border-gray-300">📍</span>
                    <input
                        type="text"
                        placeholder="Search destination..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setDropdownOpen(true);
                        }}
                        onFocus={() => setDropdownOpen(true)}
                        className="w-full px-4 py-2 focus:outline-none"
                    />
                    <Search className="text-gray-400 mr-3" size={20} />
                </div>

                {dropdownOpen && (
                    <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredDestinations.length > 0 ? (
                            filteredDestinations.map((destination) => (
                                <li
                                    key={destination.id}
                                    onClick={() => {
                                        setSelectedDestination(destination.city);
                                        setSearchTerm(destination.city);
                                        setDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {destination.city}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No destinations found</li>
                        )}
                    </ul>
                )}
            </div>
            <button
                onClick={handleSearch}
                className="bg-purple-900 text-white border border-purple-900 px-6 py-2 rounded-full hover:bg-transparent hover:text-purple-900 transition duration-300"
            >
                Search
            </button>
        </div>
    );
};

export default DestinationSearch;
