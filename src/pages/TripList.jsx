import React, { useState, useEffect } from 'react'
import { fetchCamptypeById } from '../service/BookingService';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

const TripList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { booking } = useBooking();
    const [bookingDetails, setBookingDetails] = useState(booking.bookingDetails);
    const [camptypes, setCamptypes] = useState([]);
    const [isInBooking, setIsInBooking] = useState(true);

    const campsiteId = booking.campSiteId;

    const fetchSelectedCamptypeList = async () => {
        setLoading(true);
        try {
            const campTypeList = await fetchCamptypeById(campsiteId) || [];
            const selectedCamptypes = campTypeList.filter(camptype =>
                bookingDetails.some(bookingDetail => bookingDetail.campTypeId === camptype.id)
            );
            console.log(booking)
            setCamptypes(selectedCamptypes);
        } catch (error) {
            setError(error);
            throw new Error(`Failed to fetch camptypes: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSelectedCamptypeList();
    }, []);

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
            <div className="flex justify-center gap-4 pt-8 z-10">
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
                camptypes.length > 0 ? (
                    <div>
                        {
                            camptypes.map(camptype => (
                                <div key={camptype.id} className=''>
                                    <div className='flex gap-12 pt-10 pb-16 px-8'>
                                        <div className='left-container w-1/3'>
                                            <img src={camptype.image} alt={camptype.type} />
                                        </div>
                                        <div className='middle-container w-1/2'>
                                            <p className='font-canto text-4xl pb-8'>{camptype.type}</p>
                                            <p className='text-purple-900 uppercase font-serif tracking-tight pb-4'>Description</p>
                                            <p className='text-gray-500 font-light text-lg'>{camptype.description}</p>
                                        </div>
                                        <div className="right-container w-1/6 space-y-3">
                                            <p className="text-gray-500 font-light">Quantity {camptype.quantity} </p>
                                            <p className="text-gray-500 font-light">Price {camptype.price}VND</p>
                                        </div>
                                    </div>
                                    <hr className='mt-6' />
                                </div>
                            ))
                        }
                        < div className='flex justify-end'>
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
                <p>p</p>
            )
            }
        </div >
    )
}
export default TripList
