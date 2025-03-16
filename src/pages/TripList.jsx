import React, { useState, useEffect } from 'react'
import { fetchCamptypeById, fetchCampsiteById, fetchBookingByUserId } from '../service/BookingService';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { format, differenceInDays } from 'date-fns';

const TripList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { booking } = useBooking();
    const [bookingDetails, setBookingDetails] = useState(booking.bookingDetails);
    const [camptypes, setCamptypes] = useState([]);
    const [isInBooking, setIsInBooking] = useState(true);
    const [campsite, setCampsite] = useState({});
    const [selections, setSelections] = useState([]);
    const [nights, setNights] = useState(0);
    const [bookedList, setBookedList] = useState([]);

    const campsiteId = booking.campSiteId;
    const { user } = useUser();
    const isLoggedIn = !!user;

    const fetchSelectedCamptypeList = async () => {
        setLoading(true);
        try {
            const campTypeList = await fetchCamptypeById(campsiteId);
            const selectedCamptypes = campTypeList.filter(camptype =>
                bookingDetails.some(bookingDetail => bookingDetail.campTypeId === camptype.id)
            );
            console.log(selectedCamptypes)
            console.log(booking)
            setCamptypes(selectedCamptypes);
        } catch (error) {
            setError(error);
            throw new Error(`Failed to fetch camptypes: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingByUser = async () => {
        try {
            const bookings = await fetchBookingByUserId(user.id);
            console.log(bookings)
            setBookedList(bookings || []);

            return bookings;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const fetchCampsite = async () => {
        try {
            const campsite = await fetchCampsiteById(campsiteId);
            const selectedSelections = campsite[0].campSiteSelectionsList.filter(selection =>
                booking.bookingSelectionRequestList.some(request => request.idSelection === selection.id)
            )
            setSelections(selectedSelections);
            setCampsite(campsite[0]);
            console.log(campsite)
        } catch (error) {
            setError(error);
            throw new Error(`Failed to fetch campsite: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (booking.checkInTime && booking.checkOutTime) {
            const nights = Math.max(0, differenceInDays(new Date(booking.checkOutTime), new Date(booking.checkInTime)));
            setNights(nights);
        }
    }, []);

    function mergeCampTypes(bookingDetailResponseList) {
        const mergedCampTypes = {};

        bookingDetailResponseList.forEach(detail => {
            const campType = detail.campTypeResponse;
            if (!campType) return;

            const type = campType.type;
            const price = campType.price; // Giá cơ bản trong ngày thường
            const weekendRate = campType.weekendRate; // Giá vào cuối tuần

            if (!mergedCampTypes[type]) {
                mergedCampTypes[type] = {
                    ...campType,
                    totalQuantity: 0,
                    totalAmount: 0
                };
            }

            mergedCampTypes[type].totalQuantity += 1;

            // Tính tiền dựa trên số lượng và giá tiền (giả sử check-in có cả ngày thường và cuối tuần)
            const totalDays = 2; // Ví dụ ở đây từ 15 đến 17 là 2 ngày
            const weekendDays = 1; // Giả sử có 1 ngày cuối tuần
            const normalDays = totalDays - weekendDays;

            const totalAmount = (normalDays * price + weekendDays * weekendRate);
            mergedCampTypes[type].totalAmount += totalAmount;
        });
        return Object.values(mergedCampTypes);
    }

    useEffect(() => {

        if (campsiteId) {
            fetchCampsite();
            fetchSelectedCamptypeList();
            fetchBookingByUser();
        } else {
            setLoading(false);
        }

    }, [booking]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container-fluid mx-auto min-h-screen'>
            {isLoggedIn ? (
                <>
                    <div className="flex justify-center gap-4 pt-4 z-10">
                        <button
                            onClick={() => setIsInBooking(true)}
                            className={`px-6 py-2 text-lg border rounded-full transition-colors cursor-pointer ${isInBooking
                                ? 'bg-black text-white border-black'
                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            My Cart
                        </button>
                        <button
                            onClick={() => setIsInBooking(false)}
                            className={`px-6 py-2 text-lg border rounded-full transition-colors cursor-pointer ${!isInBooking
                                ? 'bg-black text-white border-black'
                                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            My Booking
                        </button>
                    </div>
                    {isInBooking ? (
                        camptypes.length > 0 || campsiteId ? (
                            <div className='mx-auto'>
                                <p className='w-1/2 font-canto text-4xl pl-8'>{campsite.name}</p>

                                <hr className='mt-6' />
                                {
                                    camptypes.map((camptype, index) => (
                                        <div key={index} className=''>
                                            <div className='flex gap-12 pt-10 pb-6 px-8'>
                                                <div className='left-container w-1/3'>
                                                    <img src={camptype.image} alt={camptype.type} />
                                                </div>
                                                <div className='middle-container w-1/2'>
                                                    <p className='font-canto text-4xl pb-8'>{camptype.type}</p>
                                                    <p className='text-purple-900 uppercase font-serif tracking-tight pb-4'>Camptype amennities</p>
                                                    <div className='flex gap-14'>
                                                        {camptype.facilities.map((facility, index) => (
                                                            <p key={index} className="text-lg font-canto uppercase gap-2">
                                                                • {facility.name}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="right-container w-1/6 space-y-3">
                                                    <p className="text-gray-500 font-light">Quantity {booking.bookingDetails[index].quantity} </p>
                                                    <p className="text-gray-500 font-light">Price: {camptype.price.toLocaleString("vi-VN")}VND per night</p>
                                                </div>
                                            </div>
                                            <hr className='mt-6' />
                                        </div>
                                    ))
                                }
                                < div className='flex justify-end gap-4 items-center mt-6'>
                                    <div className='flex w-1/2 px-8 pt-4'>
                                        <p className="w-1/2 font-canto text-xl">
                                            Check-In Date: {format(new Date(booking.checkInTime), "dd MMM yyyy")}
                                        </p>
                                        <p className="w-1/2 font-canto text-xl">
                                            Check-Out Date: {format(new Date(booking.checkOutTime), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                    <p className='font-canto text-xl text-purple-900 pt-3'>Total {nights} nights (taxes incl.): {booking.totalAmount.toLocaleString("vi-VN")}VND</p>
                                    <Link to={`/campsite/${campsiteId}/extra-service`}>
                                        <button className="bg-black text-white border-black border uppercase mb-2 p-4 transform duration-300 
                                ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black mr-2 mt-2">
                                            Proceed to payment
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col justify-center items-center space-y-5 translate-y-44'>
                                <p className='text-2xl font-canto'>No booking details</p>
                                <Link to="/">
                                    <button className="bg-black w-48 text-white border-black border uppercase p-4 transform duration-300 
                            ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black">
                                        Back to home page
                                    </button>
                                </Link>
                            </div>

                        )
                    ) : (
                        <div>
                            {bookedList && bookedList.length > 0 ? (
                                <div>
                                    {bookedList.map((booking, index) => (
                                        <div key={index} className=''>
                                            <div className='gap-12 pt-10 pb-6 px-16'>
                                                <div className='flex items-center justify-between gap-20'>
                                                    <p className='font-canto text-4xl pb-2 w-3/4'>
                                                        🏕️ {booking.campSite.name}
                                                    </p>
                                                    <p className='font-canto text-3xl pb-2 w-1/4'>Booking Status: <span className='text-purple-900'>{booking.status}</span></p>
                                                </div>
                                                <hr className='mb-4' />
                                                <div className='flex w-full justify-between gap-24 px-2'>
                                                    <div className='w-3/4'>
                                                        <p className="font-canto text-xl">
                                                            Check-In Date: {format(new Date(booking.checkIn), "dd MMM yyyy")}
                                                        </p>
                                                        <p className="font-canto text-xl">
                                                            Check-Out Date: {format(new Date(booking.checkOut), "dd MMM yyyy")}
                                                        </p>
                                                    </div>
                                                    <div className='w-1/4'>
                                                        <p className='text-purple-900 text-xl uppercase font-serif tracking-tight mt-2 pb-2'>Extra service(s)</p>
                                                        {booking.bookingSelectionResponseList.length > 0 ? (
                                                            booking.bookingSelectionResponseList.map((selection, index) => (
                                                                <p key={index} className="text-lg font-canto uppercase gap-2">
                                                                    • {selection.name}: {(parseFloat(selection.quantity) * parseFloat(selection.totalAmount)).toLocaleString("vi-vn")}VND
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p className="text-xl font-canto text-gray-500">None of services selected</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='text-purple-900 uppercase text-xl font-serif tracking-tight mt-2 pb-2'>Camp type(s) booking</p>
                                                    {mergeCampTypes(booking.bookingDetailResponseList).map((detail, index) => (
                                                        <div key={index} className='flex gap-12 pt-6 pb-6 px-2'>
                                                            <div className='left-container w-1/3'>
                                                                <img src={detail.image} alt="Image Camptype" />
                                                            </div>
                                                            <div className='middle-container w-5/12'>
                                                                <p className='font-canto text-4xl pb-8'>{detail.type}</p>
                                                                <p className='text-purple-900 uppercase font-serif tracking-tight pb-4'>Camptype amennities</p>
                                                                <div className='flex gap-14'>
                                                                    {detail.facilities.map((facility, index) => (
                                                                        <p key={index} className="text-lg font-canto uppercase gap-2">
                                                                            • {facility.name}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="right-container w-1/4 space-y-3">
                                                                <p className="font-canto text-2xl">Total Quantity: {detail.totalQuantity} </p>
                                                                <p className="font-canto text-2xl">Total Price: {detail.totalAmount.toLocaleString("vi-VN")}VND</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                            <hr className='mt-6' />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='flex flex-col justify-center items-center space-y-5 translate-y-44'>
                                    <p className='text-2xl font-canto'>No booking details</p>
                                    <Link to="/">
                                        <button className="bg-black w-48 text-white border-black border uppercase p-4 transform duration-300 
                                        ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black">
                                            Back to home page
                                        </button>
                                    </Link>
                                </div>
                            )}

                        </div>
                    )
                    }
                </>
            ) : (
                <>
                    <div className='flex flex-col justify-center items-center space-y-5 translate-y-72'>
                        <p className='text-2xl font-canto'>Please login to view personal trip.</p>
                        <Link to="/login">
                            <button className="bg-black w-48 text-white border-black border uppercase p-4 transform duration-300 
                            ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black">
                                Go to login page
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div >
    )
}
export default TripList
