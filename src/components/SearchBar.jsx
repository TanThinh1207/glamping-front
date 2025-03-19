import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserFriends, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import { useMatch } from "react-router-dom";
import { fetchAllCampsites } from "../service/BookingService";
import { useNavigate } from "react-router-dom";

// Weather icon imports
import ic1 from "../assets/icons/01d.png";
import ic2 from "../assets/icons/02d.png";
import ic3 from "../assets/icons/03d.png";
import ic4 from "../assets/icons/04d.png";
import ic9 from "../assets/icons/09d.png";
import ic10 from "../assets/icons/10d.png";
import ic11 from "../assets/icons/11d.png";
import ic13 from "../assets/icons/13d.png";
import ic50 from "../assets/icons/50d.png";
import icn01 from "../assets/icons/01n.png";
import icn02 from "../assets/icons/02n.png";
import icn03 from "../assets/icons/03n.png";
import icn04 from "../assets/icons/04n.png";
import icn09 from "../assets/icons/09n.png";
import icn10 from "../assets/icons/10n.png";
import icn11 from "../assets/icons/11n.png";
import icn13 from "../assets/icons/13n.png";
import icn50 from "../assets/icons/50n.png";

const vietnamCities = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Hội An" },
  { id: 5, name: "Nha Trang" },
  { id: 6, name: "Huế" },
  { id: 7, name: "Cần Thơ" },
  { id: 8, name: "Đà Lạt" },
  { id: 9, name: "Phú Quốc" },
  { id: 10, name: "Vũng Tàu" }
];

const SearchBar = ({ onSearch, hideDestination = false }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isCampsiteRoute = useMatch("/glamping/:location");

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const [destination, setDestination] = useState(null);
  const [checkInDate, setCheckInDate] = useState(
    localStorage.getItem("checkInDate") ? dayjs(localStorage.getItem("checkInDate")) : null
  );
  const [checkOutDate, setCheckOutDate] = useState(
    localStorage.getItem("checkOutDate") ? dayjs(localStorage.getItem("checkOutDate")) : null
  );
  const [guests, setGuests] = useState(localStorage.getItem("guests") ? JSON.parse(localStorage.getItem("guests")) : 1);

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(dayjs());
  const daysInMonth = currentDate.daysInMonth();
  const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const [campsites, setCampsites] = useState([]);
  const [campsiteCities, setCampsiteCities] = useState([]);
  const [selectedCampsite, setSelectedCampsite] = useState(null);

  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Weather icon mapping
  const iconMap = {
    "01d": ic1,
    "02d": ic2,
    "03d": ic3,
    "04d": ic4,
    "09d": ic9,
    "10d": ic10,
    "11d": ic11,
    "13d": ic13,
    "50d": ic50,
    "01n": icn01,
    "02n": icn02,
    "03n": icn03,
    "04n": icn04,
    "09n": icn09,
    "10n": icn10,
    "11n": icn11,
    "13n": icn13,
    "50n": icn50,
  };

  const handleMonthChange = async (direction) => {
    const newDate = currentDate.add(direction, "month");
    setCurrentDate(newDate);
    await fetchWeatherForMonth(newDate);
  };

  const handleCheckInDate = (day) => {
    const selectedDate = currentDate.date(day);

    if (selectedDate.isBefore(dayjs(), "day")) return;

    setCheckInDate(selectedDate);
    setIsCheckInOpen(false);

    if (checkOutDate && selectedDate.isAfter(checkOutDate)) {
      setCheckOutDate(null);
      localStorage.removeItem("checkOutDate");
    }

    localStorage.setItem("checkInDate", selectedDate.toISOString());
  };

  const handleCheckOutDate = (day) => {
    const selectedDate = currentDate.date(day);
    setCheckOutDate(selectedDate);
    setIsCheckOutOpen(false);
    localStorage.setItem("checkOutDate", selectedDate.toISOString());
  };

  const increaseGuest = () => {
    const newCount = guests + 1;
    setGuests(newCount);
    localStorage.setItem("guests", JSON.stringify(newCount));
  };

  const decreaseGuest = () => {
    const newCount = Math.max(1, guests - 1);
    setGuests(newCount);
    localStorage.setItem("guests", JSON.stringify(newCount));
  };

  const getCampsiteCity = async (campsites) => {
    try {
      const cityList = [...new Set(campsites.map(campsite => campsite.city))]
        .filter(city => city)
        .map((city, index) => ({ id: index + 1, name: city }));
      setCampsiteCities(cityList);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
      return;
    }

    // Always navigate to /campsite, regardless of destination selection
    navigate("/campsite");
  };

  // Update findCampsiteByCity to find matching campsite when a destination is selected
  const findCampsiteByCity = (cityName) => {
    if (!cityName || !campsites.length) return null;
    return campsites.find(campsite => campsite.city === cityName);
  };

  // Handle destination selection
  useEffect(() => {
    if (destination && campsites.length) {
      const matchingCampsite = findCampsiteByCity(destination.name);
      setSelectedCampsite(matchingCampsite);
    }
  }, [destination, campsites]);

  // Fetch weather data for a given month using lat/long
  const fetchWeatherForMonth = async (date) => {
    setWeatherLoading(true);
    const API_KEY = "b08133ab7b0e7568563cc30232f528e2";

    let latitude, longitude;

    if (selectedCampsite && selectedCampsite.latitude && selectedCampsite.longitude) {
      // Use selected campsite coordinates
      latitude = selectedCampsite.latitude;
      longitude = selectedCampsite.longitude;
    } else {
      // Default coordinates for Ho Chi Minh City if no campsite is selected
      latitude = 10.8231;
      longitude = 106.6297;
    }

    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    try {
      const response = await axios.get(URL);
      // Process forecast data into a map of date -> weather icon
      const monthData = {};

      response.data.list.forEach(item => {
        const forecastDate = dayjs.unix(item.dt);
        const dateKey = forecastDate.format('YYYY-MM-DD');

        // Only store data for the current month we're viewing
        if (forecastDate.month() === date.month() && forecastDate.year() === date.year()) {
          // If we don't have weather for this date yet, or this is a daytime reading (prefer daytime)
          if (!monthData[dateKey] || item.weather[0].icon.includes('d')) {
            monthData[dateKey] = {
              icon: item.weather[0].icon,
              temp: Math.round(item.main.temp),
              description: item.weather[0].description
            };
          }
        }
      });

      setWeatherData(monthData);
      setWeatherLoading(false);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setWeatherLoading(false);
    }
  };

  // Helper function to get weather for a specific day
  const getWeatherForDay = (day) => {
    const dateString = currentDate.date(day).format('YYYY-MM-DD');
    return weatherData[dateString];
  };

  useEffect(() => {
    // Fetch campsites when component mounts
    const fetchCampsites = async () => {
      setLoading(true);
      try {
        const response = await fetchAllCampsites();
        setCampsites(response);
        getCampsiteCity(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampsites();
  }, []);

  // Fetch weather data when current date or selected campsite changes
  useEffect(() => {
    fetchWeatherForMonth(currentDate);
  }, [currentDate, selectedCampsite]);

  // Render the calendar with weather icons
  const renderCalendar = (handleDateSelect, selectedDate, disableCondition) => (
    <>
      <h2 className="text-md font-semibold mb-4 space-x-2">
        <span>{isCheckInOpen ? "Check-in" : "Check-out"}</span>
        <span>{currentDate.format("MMMM YYYY")}</span>
      </h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          className="px-3 py-2 rounded hover:scale-125 transition-transform duration-300"
        >
          {"<"}
        </button>
        <button
          onClick={() => handleMonthChange(1)}
          className="px-3 py-2 rounded hover:scale-125 transition-transform duration-300"
        >
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekdayLabels.map((label) => (
          <span key={label} className="text-center font-semibold">
            {label}
          </span>
        ))}
        {[...Array(daysInMonth).keys()].map((day) => {
          const dayNumber = day + 1;
          const currentDayDate = currentDate.date(dayNumber);
          const isSelected = selectedDate?.isSame(currentDayDate, "day");
          const isDisabled = disableCondition(currentDayDate);
          const weatherInfo = getWeatherForDay(dayNumber);

          return (
            <div
              key={day}
              className="relative"
            >
              <button
                onClick={() => !isDisabled && handleDateSelect(dayNumber)}
                className={`p-3 text-sm rounded w-full ${isSelected
                    ? "bg-black text-white"
                    : isDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                disabled={isDisabled}
              >
                {dayNumber}
              </button>
              {weatherInfo && (
                <div className="absolute top-0 right-0 z-10">
                  <img
                    src={iconMap[weatherInfo.icon]}
                    alt={weatherInfo.description}
                    className="w-6 h-6"
                    title={`${weatherInfo.temp}°C - ${weatherInfo.description}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="pb-6 pt-10 w-full flex justify-center">
      <div className={`border border-black flex flex-col md:flex-row ${isCampsiteRoute ? "w-3/4" : "w-full"} gap-4 md:shadow-md md:rounded-xl py-4 px-2 md:mx-auto 
                      justify-center items-center`}>
        {/* Only show destination dropdown if hideDestination is false and not on campsite route */}
        {!hideDestination && !isCampsiteRoute && (
          <Dropdown
            items={campsiteCities}
            selected={destination}
            onSelect={setDestination}
          />
        )}

        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
          {/* Only show the divider if destination dropdown is shown */}
          {!hideDestination && !isCampsiteRoute && (
            <div className="border-l border-gray-400 h-6 hidden md:block"></div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="w-full md:w-auto px-4 py-2"
            >
              <span>
                {checkInDate ? checkInDate.format("MMM DD, YYYY") : "Check-In"}
              </span>
            </button>
            <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
            <button
              onClick={() => setIsCheckOutOpen(true)}
              className="w-full md:w-auto px-4 py-2"
            >
              <span>
                {checkOutDate ? checkOutDate.format("MMM DD, YYYY") : "Check-Out"}
              </span>
            </button>
          </div>
        </div>

        <Modal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)}>
          {weatherLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading weather data...</p>
            </div>
          ) : (
            renderCalendar(
              handleCheckInDate,
              checkInDate,
              (date) => date.isBefore(dayjs(), "day")
            )
          )}
        </Modal>

        <Modal isOpen={isCheckOutOpen} onClose={() => setIsCheckOutOpen(false)}>
          {weatherLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading weather data...</p>
            </div>
          ) : (
            renderCalendar(
              handleCheckOutDate,
              checkOutDate,
              (date) => checkInDate && date.isBefore(checkInDate.add(1, 'day'))
            )
          )}
        </Modal>

        <div className="border-l border-gray-400 h-6 hidden md:block"></div>
        <div
          className="flex items-center gap-x-4 p-4 rounded-md cursor-pointer"
          onClick={() => setIsGuestModalOpen(true)}
        >
          <FontAwesomeIcon icon={faUserFriends} className="text-md" />
          <p className="text-gray-800">
            <span>{guests} </span><span>Guests</span>
          </p>
        </div>
        <Modal isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)}>
          <div className="border-b pb-3 mb-4">
            <h3 className="text-md font-semibold text-gray-800">Select Guests</h3>
          </div>
          <div className="flex justify-between gap-2 items-center mb-4">
            <p className="text-gray-700">Guests</p>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={decreaseGuest}
                className="px-4 py-2 text-md border-r border-gray-300 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-6 py-2 text-md">{guests}</span>
              <button
                onClick={increaseGuest}
                className="px-4 py-2 text-md border-l border-gray-300 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </Modal>

        <div className="border-l border-gray-400 h-6 hidden md:block"></div>
        <button
          onClick={handleSearch}
          className="bg-black text-white text-sm rounded-3xl border-black border uppercase px-6 py-3 transform 
                    duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black space-x-2"
        >
          <span>Search</span> <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;