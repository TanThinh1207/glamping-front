import React, { useState, useEffect } from 'react';
import { fetchBookingByUserId, fetchCamptypeById } from '../service/BookingService';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { format, differenceInDays } from 'date-fns';
import OrderCard from '../components/OrderCard';

const TripList = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { booking } = useBooking();
    const [isInBooking, setIsInBooking] = useState(true);
    const [bookedList, setBookedList] = useState([]);
    const [nights, setNights] = useState(0);
    const [camptypes, setCamptypes] = useState([]);
    const [capacityLimit, setCapacityLimit] = useState(0);
    const [services, setServices] = useState([]);

    const { user } = useUser();
    const isLoggedIn = !!user;

    // Fetch user bookings
    const fetchBookingByUser = async () => {
        try {
            setLoading(true);
            const bookings = await fetchBookingByUserId(user.id);
            setBookedList(bookings || []);
            return bookings;
        } catch (error) {
            setError(error.message);
            throw new Error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchServices = async () => {
        setLoading(true);
        try {
            const campSiteId = booking.campSiteId;
            const url = new URL(`${import.meta.env.VITE_API_GET_SERVICES}`);
            url.searchParams.append('campSiteId', campSiteId);
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error(`Failed to fetch services: ${response.statusText}`);

            const data = await response.json();
            setServices(data.data.content);
            console.log(data.data.content);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (booking.campSiteId) {
            fetchServices();
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchBookingByUser();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (booking.bookingDetails && booking.bookingDetails.length > 0) {
            // Calculate nights
            const checkInDate = new Date(booking.bookingDetails[0].checkInAt);
            const checkOutDate = new Date(booking.bookingDetails[0].checkOutAt);

            const nights = Math.max(0, differenceInDays(checkOutDate, checkInDate));
            setNights(nights);
        }
    }, [booking]);

    // Fetch camp types
    useEffect(() => {
        const fetchCamptypes = async () => {
            try {
                if (!booking.campSiteId) return;

                const camptypesData = await fetchCamptypeById(booking.campSiteId);
                setCamptypes(camptypesData || []);

                if (booking?.bookingDetails?.length > 0 && camptypesData?.length > 0) {
                    let totalCapacity = 0;
                    booking.bookingDetails.forEach((item) => {
                        const campType = camptypesData.find((type) => type.id === item.campTypeId);
                        if (campType) {
                            totalCapacity += campType.capacity * item.quantity;
                        }
                    });
                    setCapacityLimit(totalCapacity);
                }
            } catch (error) {
                console.error("Error fetching camptypes:", error);
                setError("Failed to load camp types");
            }
        };

        if (booking.campSiteId) {
            fetchCamptypes();
        }
    }, [booking]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }

    if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

    // Check if we have all necessary data
    const hasAllCampTypeDetails = booking.bookingDetails?.every(
        detail => camptypes.some(camptype => camptype.id === detail.campTypeId)
    ) ?? false;

    return (
        <div className='container mx-auto px-4 py-8 min-h-screen'>
            {isLoggedIn ? (
                <>
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setIsInBooking(true)}
                            className={`px-6 py-2 text-lg border rounded-full transition-colors ${isInBooking
                                ? 'bg-black text-white border-black'
                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            My Cart
                        </button>
                        <button
                            onClick={() => setIsInBooking(false)}
                            className={`px-6 py-2 text-lg border rounded-full transition-colors ${!isInBooking
                                ? 'bg-black text-white border-black'
                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            My Booking
                        </button>
                    </div>

                    {isInBooking ? (
                        // My Cart View
                        booking && booking.campSiteId ? (
                            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h2 className="font-canto text-3xl mb-4">Current Booking</h2>

                                    {/* Display current booking details */}
                                    {booking.bookingDetails && booking.bookingDetails.length > 0 ? (
                                        <div>
                                            <div className="mb-6 flex justify-between">
                                                <p className="font-canto text-xl mb-2">
                                                    Check-In: {format(new Date(booking.bookingDetails[0].checkInAt), 'yyyy-MM-dd')}
                                                </p>
                                                <p className="font-canto text-xl mb-4">
                                                    Check-Out: {format(new Date(booking.bookingDetails[0].checkOutAt), 'yyyy-MM-dd')}
                                                </p>
                                                <p className="font-canto text-xl mb-4">Duration: {nights} nights</p>
                                                {capacityLimit > 0 && (
                                                    <p className="font-canto text-xl mb-4">Total Capacity: {capacityLimit} people</p>
                                                )}
                                            </div>

                                            {/* Display all camp type details */}
                                            {hasAllCampTypeDetails ? (
                                                booking.bookingDetails.map((detail, index) => {
                                                    const campType = camptypes.find(type => type.id === detail.campTypeId);
                                                    if (!campType) return null;

                                                    return (
                                                        <div key={index} className="flex py-4 border-t">
                                                            <div className="w-1/4 pr-4">
                                                                <img
                                                                    src={campType.image}
                                                                    alt={campType.type}
                                                                    className="w-full object-cover rounded"
                                                                />
                                                            </div>
                                                            <div className="w-3/4">
                                                                <h3 className="font-canto text-2xl mb-2">{campType.type}</h3>
                                                                <div className="flex justify-between mb-2">
                                                                    <p className=" font-canto text-xl">
                                                                        Price: <span className='text-purple-900'>{campType.price?.toLocaleString("vi-VN")}VND per night</span>
                                                                    </p>
                                                                    <p className="font-canto text-xl">
                                                                        Quantity: <span className='text-purple-900'>{detail.quantity}</span>
                                                                    </p>
                                                                </div>
                                                                <p className="text-gray-600 mb-2 font-canto text-xl">
                                                                    Capacity: {campType.capacity} people per unit
                                                                </p>
                                                                <p className="font-canto justify-between text-2xl">
                                                                    Subtotal: <span className='text-purple-900'>{(campType.price * detail.quantity * nights).toLocaleString("vi-VN")} VND</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">Loading camp type details...</p>
                                            )}

                                            {/* Display extra services if any */}
                                            {booking.bookingSelectionRequestList &&
                                                booking.bookingSelectionRequestList.length > 0 &&
                                                services.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <h3 className="font-canto text-xl mb-3">Extra Services</h3>
                                                        {booking.bookingSelectionRequestList.map((selection, index) => {
                                                            const service = services.find(s => s.id === selection.idSelection);
                                                            return service ? (
                                                                <div key={index} className="flex justify-between mb-2">
                                                                    <div className="flex gap-4 font-canto text-xl">
                                                                        <span>{service.name}</span>
                                                                        <span className="text-gray-500">x{selection.quantity}</span>
                                                                    </div>
                                                                    <span className='font-canto text-xl text-purple-900'>
                                                                        {(service.price * selection.quantity).toLocaleString("vi-VN")} VND
                                                                    </span>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                )}

                                            <div className="mt-6 pt-4 border-t border-gray-300">
                                                <div className="flex justify-between text-xl font-canto">
                                                    <span>Total Amount:</span>
                                                    <span className="text-purple-900">
                                                        {booking.totalAmount?.toLocaleString("vi-VN")}VND
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex justify-end">
                                                <Link to={`/campsite/${booking.campSiteId}/extra-service`}>
                                                    <button className="bg-black text-white border border-black uppercase px-6 py-3 hover:bg-transparent hover:text-black transition-colors">
                                                        Proceed to payment
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-6">No items in cart</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 translate-y-28">
                                <p className="text-2xl font-canto mb-6">Your cart is empty</p>
                                <Link to="/campsite">
                                    <button className="bg-black text-white border border-black uppercase px-6 py-3 hover:bg-transparent hover:text-black transition-colors">
                                        Explore Campsites
                                    </button>
                                </Link>
                            </div>
                        )
                    ) : (
                        //My Booking View
                        <div className="max-w-4xl mx-auto">
                            <h2 className="font-canto text-3xl mb-6">My Booking</h2>

                            {bookedList && bookedList.length > 0 ? (
                                bookedList.map((booking, index) => (
                                    <OrderCard key={index} booking={booking} />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow translate-y-28">
                                    <p className="text-2xl font-canto mb-6">No booking history</p>
                                    <Link to="/campsite">
                                        <button className="bg-black text-white border border-black uppercase px-6 py-3 hover:bg-transparent hover:text-black transition-colors">
                                            Explore Campsites
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 translate-y-40">
                    <p className="text-2xl font-canto mb-6">Please login to view your trips</p>
                    <Link to="/login">
                        <button className="bg-black w-48 text-white border border-black uppercase px-6 py-3 hover:bg-transparent hover:text-black transition-colors">
                            Go to login page
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TripList;