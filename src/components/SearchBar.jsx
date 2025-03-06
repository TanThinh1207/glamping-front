import React, { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserFriends, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import Dropdown from "../components/Dropdown";
import { useMatch } from "react-router-dom";

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

const SearchBar = () => {
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

  const handleMonthChange = (direction) => {
    setCurrentDate(currentDate.add(direction, "month"));
  };

  const handleCheckInDate = (day) => {
    const selectedDate = currentDate.date(day);
    setCheckInDate(selectedDate);
    setIsCheckInOpen(false);
    if (checkOutDate && selectedDate.isAfter(checkOutDate) + 1) {
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
    setGuests((prev) => prev + 1);
    localStorage.setItem("guests", JSON.stringify(guests));
  }
  const decreaseGuest = () => {
    setGuests((prev) => Math.max(1, prev - 1));
    localStorage.setItem("guests", JSON.stringify(guests));
  }

  return (
    <div className="pb-6 pt-10 w-full flex justify-center">
      <div className={`border border-black flex flex-col md:flex-row ${isCampsiteRoute ? "w-3/4" : "w-full"} gap-4 md:shadow-md md:rounded-xl py-4 px-2 md:mx-auto 
                      justify-center items-center`}>
        {!isCampsiteRoute && (
          <Dropdown
            items={vietnamCities}
            selected={destination}
            onSelect={setDestination}
          />
        )}

        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
          {!isCampsiteRoute && (
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
          <h2 className="text-md font-semibold mb-4 space-x-2">
            <span>Check-in</span><span>{currentDate.format("MMMM YYYY")}</span>
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
              const selectedDate = currentDate.date(day + 1);
              const isSelected = checkInDate?.isSame(selectedDate, "day");

              return (
                <button
                  key={day}
                  onClick={() => handleCheckInDate(day + 1)}
                  className={`p-3 text-sm rounded ${isSelected
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                    }`}
                >
                  {day + 1}
                </button>
              );
            })}
          </div>
        </Modal>

        <Modal isOpen={isCheckOutOpen} onClose={() => setIsCheckOutOpen(false)}>
          <h2 className="text-md font-semibold mb-4 space-x-2">
            <span>Check-out</span><span>{currentDate.format("MMMM YYYY")}</span>
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
              const selectedDate = currentDate.date(day + 1);
              const isSelected = checkOutDate?.isSame(selectedDate, "day");
              const isBeforeCheckIn = checkInDate && selectedDate.isBefore(checkInDate.add(1, 'day'));

              return (
                <button
                  key={day}
                  onClick={() => !isBeforeCheckIn && handleCheckOutDate(day + 1)}
                  className={`p-3 text-sm ${isSelected
                    ? "bg-black text-white"
                    : isBeforeCheckIn
                      ? "bg-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                    }`}
                  disabled={isBeforeCheckIn}
                >
                  {day + 1}
                </button>
              );
            })}
          </div>
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
        <button className="bg-black text-white text-sm rounded-3xl border-black border uppercase px-6 py-3 transform 
                      duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black space-x-2">
          <span>Search</span> <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;