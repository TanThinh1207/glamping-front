import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import thumb from "../assets/thumb.jpg";
import feature1 from "../assets/feature1.jpg";
import feature2 from "../assets/feature2.jpg";
import feature3 from "../assets/feature3.jpg";
import feature4 from "../assets/feature4.jpg";
import feature5 from "../assets/feature5.jpg";
import feature6 from "../assets/feature6.jpg";
import feature7 from "../assets/feature7.jpg";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUserFriends, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const daysInMonth = currentDate.daysInMonth();
  const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownDirection, setDropDownDirection] = useState("down");
  const buttonRef = useRef(null);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const increaseAdults = () => setAdults((prev) => prev + 1);
  const decreaseAdults = () => setAdults((prev) => Math.max(1, prev - 1));
  const increaseChildren = () => setChildren((prev) => prev + 1);
  const decreaseChildren = () => setChildren((prev) => Math.max(0, prev - 1));

  const handleMonthChange = (direction) => {
    setCurrentDate(currentDate.add(direction, "month"));
  };

  const handleCheckInDate = (day) => {
    const selectedDate = currentDate.date(day);
    setCheckInDate(selectedDate);
    setIsCheckInOpen(false);
    if (checkOutDate && selectedDate.isAfter(checkOutDate)) {
      setCheckOutDate(null);
    }
  };

  const handleCheckOutDate = (day) => {
    const selectedDate = currentDate.date(day);
    setCheckOutDate(selectedDate);
    setIsCheckOutOpen(false);
  };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  useEffect(() => {
    if (isDropDownOpen) {
      const checkDropDownDirection = () => {
        const button = buttonRef.current;
        if (button) {
          const rect = button.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          if (spaceBelow < 200 && spaceAbove > 200) {
            setDropDownDirection("up");
          } else {
            setDropDownDirection("down");
          }
        }
      };

      checkDropDownDirection();
      window.addEventListener("resize", checkDropDownDirection);

      return () => {
        window.removeEventListener("resize", checkDropDownDirection);
      };
    }
  }, [isDropDownOpen]);

  return (
    <div>
      <div className="thumb flex relative justify-center w-full" data-aos="fade">
        <img src={thumb} className="w-full h-auto" alt="Thumbnail" />
      </div>

      <div className="pb-6 pt-10 w-full flex justify-center">
        <div className="border border-black flex w-3/4 gap-x-4 shadow-lg rounded-md py-4 justify-center items-center">
          <div className="relative inline-block text-left" ref={buttonRef}>
            <div>
              <button
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2"
                onClick={toggleDropDown}
              >
                Select a destination
                <svg
                  className="-mr-1 size-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isDropDownOpen && (
              <div
                className={`absolute ${dropDownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
                  } right-0 z-10 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5`}
              >
                <div className="py-1" role="none">
                  <Link to="#"
                    className="block px-4 py-2 text-sm text-gray-700">
                    Ha Noi
                  </Link>
                  <Link to="#"
                    className="block px-4 py-2 text-sm text-gray-700">
                    Ho Chi Minh City
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="border-l border-gray-400 h-6"></div>

          <div className="flex justify-center items-center gap-x-4">
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="px-4 py-2 rounded flex items-center space-x-3"
            >
              <span>
                {checkInDate ? checkInDate.format("MMM DD, YYYY") : "Check-In"}
              </span>
            </button>
            <FontAwesomeIcon icon={faArrowRight} className="mx-3" />
            <button
              onClick={() => setIsCheckOutOpen(true)}
              className="px-4 py-2 rounded flex items-center space-x-3 "
            >
              <span>
                {checkOutDate ? checkOutDate.format("MMM DD, YYYY") : "Check-Out"}
              </span>
            </button>
          </div>
          <Modal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)}>
            <h2 className="text-lg font-semibold mb-4 space-x-2">
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
                    className={`p-2 text-sm rounded ${isSelected
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
            <h2 className="text-lg font-semibold mb-4 space-x-2">
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
                const isBeforeCheckIn = checkInDate && selectedDate.isBefore(checkInDate + 1);

                return (
                  <button
                    key={day}
                    onClick={() => !isBeforeCheckIn && handleCheckOutDate(day + 1)}
                    className={`p-2 text-sm ${isSelected
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

          <div className="border-l border-gray-400 h-6"></div>
          <div
            className="flex items-center gap-x-4 p-4 rounded-lg cursor-pointer"
            onClick={() => setIsGuestModalOpen(true)}
          >
            <FontAwesomeIcon icon={faUserFriends} className="text-lg" />
            <p className="text-gray-800">
              <span>{adults} Adults</span> <span>{children} Children</span>
            </p>
          </div>
          <Modal isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)}>
            <div className="border-b pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Guests</h3>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">Adults</p>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decreaseAdults}
                  className="px-4 py-2 text-lg border-r border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 text-lg">{adults}</span>
                <button
                  onClick={increaseAdults}
                  className="px-4 py-2 text-lg border-l border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700">Children</p>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decreaseChildren}
                  className="px-4 py-2 text-lg border-r border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 text-lg">{children}</span>
                <button
                  onClick={increaseChildren}
                  className="px-4 py-2 text-lg border-l border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </Modal>
          <div className="border-l border-gray-400 h-6"></div>
          <button className="bg-black text-white text-sm rounded-3xl border-black border uppercase px-6 py-3 transform 
                        duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black space-x-2">
            <span>Search</span> <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className="featured px-4">
        <p className="uppercase text-2xl font-light pt-5 pb-5">featured properties</p>
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-screen">
          <div className="left-container flex flex-col w-full lg:w-1/2" data-aos="fade-right">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature1} alt="Tent Bagolaro" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">Tent Bagolaro</p>
                <p className="text-xl italic text-white">Da Lat</p>
              </div>
            </div>
          </div>
          <div className="right-container flex flex-col w-full lg:w-1/2 space-y-6" data-aos="fade-left">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature2} alt="The Swimmingpool" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Swimmingpool</p>
                <p className="text-xl italic text-white">Quy Nhon</p>
              </div>
            </div>
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature3} alt="The Pines" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Pines</p>
                <p className="text-xl italic text-white">Sa Pa</p>
              </div>
            </div>
          </div>
        </div>
        <p className="uppercase flex justify-center text-2xl pt-8 pb-8 font-light">BOOK YOUR UNFORGETTABLE EXPERIENCE</p>
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
          <div className="left-container flex flex-col w-full lg:w-1/2 space-y-6" data-aos="fade-right">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature4} alt="The Luxury" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Luxury</p>
                <p className="text-xl italic text-white">Da Nang</p>
              </div>
            </div>
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature5} alt="The Isveita" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Isveita</p>
                <p className="text-xl italic text-white">Phu Quoc</p>
              </div>
            </div>
          </div>
          <div className="right-container flex w-full lg:w-1/2" data-aos="fade-left">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature6} alt="Tent Aminta" />
              <div className="absolute font-montserrat inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">Tent Aminta</p>
                <p className="text-xl italic text-white">Nha Trang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-wide pt-5 pb-5">
            Featured Glamping Destination
          </h1>
        </div>
        <div className="flex flex-col w-full lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="lg:w-2/3 w-full" data-aos="fade-right">
            <img src={feature7} alt="Glamping Destination" className="w-full h-auto shadow-md" />
          </div>
          <div className="lg:w-1/3 p-4 bg-white border-2 border-blue-200">
            <div className="bg-white p-4 shadow-md border-2 border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase">
                South America
              </h2>
              <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase">
                South of the Equator Adventures
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Stretching from steaming Amazonian jungles to the penguin playgrounds near Antarctica, South America represents incredible opportunities for eco-adventures, cultural learning, and otherwise exploring a unique part of the earth. Whether your desire is to chase down a blue-footed booby on the Galapagos Islands, walk where the Inca did on Machu Picchu, or explore the vast wonders of the Andes, glamping provides some excellent basecamps. From unmatched luxury in a posh Patagonian lodge, to astronomy-focused lodgings in Chile, from eco-luxury in Ecuador to the beautiful beaches of Brazil, glamping puts you in touch with this intriguing continent in ways no other type of travel ever could.
              </p>
              <button className="bg-transparent uppercase text-black border border-black w-1/2 py-2 px-6 text-sm hover:bg-blue-400 hover:text-white transition duration-200">
                View Destination
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
