import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faTimes, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../css/NavigationBar.css";
import logo from "../assets/word-logo.png";
import { useBooking } from "../context/BookingContext";

const getMenuItems = (path) => {
    switch (true) {
        case path.startsWith("/hosting/create-campsite"):
            return [
            ];
        case path.startsWith("/hosting"):
            return [
                { name: "Today", link: "/hosting" },
                { name: "Calendar", link: "/hosting/calendar" },
                { name: "Listings", link: "/hosting/listings" },
                { name: "Reservations", link: "/hosting/reservations" },
            ];
        default:
            return [
                { name: "Campsite", link: "/campsite" },
                { name: "About", link: "/about" },
                { name: "Become a Host", link: "/hosting" },
            ];
    }
};


const NavigationBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(window.innerWidth < 1280);
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const { booking } = useBooking();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        const handleResize = () => {
            setIsMinimized(window.innerWidth < 1280);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // useEffect(() => {
    //     const fetchBookingCount = () => {
    //         const storedBooking = JSON.parse(localStorage.getItem("booking"));
    //         if (storedBooking && storedBooking.bookingDetails) {
    //             setBookingCount(storedBooking.bookingDetails.length);
    //         } else {
    //             setBookingCount(0);
    //         }
    //     };

    //     fetchBookingCount();
    // }, [booking]);

    const miniItems = [
        { name: "Glamping", link: "/glamping" },
        { name: "About", link: "/about" },
        { name: "Become a Host", link: "/hosting" },
        { name: "My Account", link: "/account" },
        { name: "My trip", link: "/trip" },
    ]

    const renderbutton = (path) => {
        switch (true) {
            case path.startsWith("/hosting/create-campsite"):
                return (
                    <button
                        className="bg-transparent text-black text-xl border-gray-1500 border-2 rounded-full  mb-2 py-2 px-8 font-semibold mr-2 transform duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black"
                        onClick={() => window.location.href = "/hosting"}
                    >
                        Exit
                    </button>
                );
            case path.startsWith("/hosting"):
                return (
                    <button className="bg-black text-white text-xs border-black border uppercase mb-2 p-4 transform 
                        duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black 
                        mr-2">
                        Switch to customer
                    </button>
                );
            default:
                return (
                    <>
                        <Link to="/account" className="font-canto uppercase text-xs hidden xl:inline-block">
                            <FontAwesomeIcon className="cursor-pointer hover:scale-110 transition-transform duration-200" icon={faUser} />
                            <span className="pl-1">My Account</span>
                        </Link>
                        <Link to="/trip" className="relative font-canto uppercase text-xs hidden xl:inline-block">
                            <FontAwesomeIcon className="cursor-pointer hover:scale-110 transition-transform duration-200 pr-1" icon={faCartShopping} />
                            <span>My Trip</span>
                        </Link>
                        <button className="bg-black text-white text-xs border-black border uppercase mb-2 p-4 transform duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black mr-2">
                            Check availability
                        </button>
                    </>
                );

        }
    }

    const menuItems = getMenuItems(location.pathname);
    return (
        <div
            className={`fixed w-full z-10 transition-colors duration-500 ${isScrolled || !isHomePage ? "bg-white" : "bg-transparent"
                }`}
        >
            <div className="flex items-center px-3 pt-3">
                <div className="left-container flex w-1/2">
                    <div className={`flex justify-center items-center lg:justify-start w-2/3 xl:w-1/3`}>
                        <Link className="pr-10" to="/">
                            <img src={logo} alt="Logo AstroGlampé" />
                        </Link>
                    </div>
                    {!isMinimized && (
                        <ul
                            className={`flex uppercase justify-center items-center space-x-7 list-none pt-3 pb-3`}
                        >
                            {menuItems.map((menuItem, i) => (
                                <li key={i} className="nav-link font-canto text-xs cursor-pointer">
                                    <Link to={menuItem.link}>{menuItem.name}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-end items-center pr-5 text-2xl">
                        <FontAwesomeIcon
                            className="xl:hidden cursor-pointer hover:rotate-90 transition-transform duration-500 ease-in-out"
                            icon={faBars}
                            onClick={toggleMenu}
                        />
                    </div>
                    <div
                        className={`fixed inset-0 bg-white p-8 transform ${menuOpen ? "translate-x-0" : "translate-x-full"
                            } transition-transform duration-500 ease-in-out z-10`}
                    >
                        <div className="flex justify-end">
                            <FontAwesomeIcon
                                icon={faTimes}
                                size="2x"
                                className="cursor-pointer hover:rotate-90 transition-transform duration-500 ease-in-out"
                                onClick={toggleMenu}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-center">
                                <img className="w-1/2 mb-12" src={logo} alt="Logo AstroGlampé" />
                            </div>
                        </div>
                        <ul className="flex flex-col items-center uppercase pt-10 space-y-16 text-xl">
                            {miniItems.map((menuItem, i) => (
                                <li key={i} className="nav-link font-canto text-base cursor-pointer">
                                    <Link to={menuItem.link}>{menuItem.name}</Link>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>
                <div className="right-container flex justify-end space-x-5 w-1/2 items-center">
                    {renderbutton(location.pathname)}
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;