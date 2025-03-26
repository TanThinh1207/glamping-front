import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { useBooking } from '../../context/BookingContext'
import { fetchCampsiteById, fetchCamptypeById, fetchCamptypeByIdWithDate, fetchRatingByCampsiteId } from '../../service/BookingService'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'
import { useUser } from '../../context/UserContext'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import dayjs from 'dayjs';

const CamptypePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useUser();

    const { updateCamptype, updateCampsite, resetBooking, booking, updateDatesBookingSummary } = useBooking();
    const { campsiteId } = useParams();

    const [campsite, setCampsite] = useState([]);
    const [camptypes, setCamptypes] = useState([]);
    const [quantities, setQuantities] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingSelection, setPendingSelection] = useState('');

    const [checkIn, setCheckIn] = useState(localStorage.getItem('checkInDate') || '');
    const [checkOut, setCheckOut] = useState(localStorage.getItem('checkOutDate') || '');

    const [isExpanded, setIsExpanded] = useState(false);
    const maxDescriptionLength = 250;

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [ratings, setRatings] = useState({ averageRating: 0, ratingResponseList: [] });

    const googleMapUrl = `https://www.google.com/maps?q=${campsite.latitude},${campsite.longitude}&hl=es;z=14&output=embed`;

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to calculate the total price based on check-in/check-out dates and quantity
    const calculateTotalPrice = (camptype) => {
        if (!checkIn || !checkOut) return null;

        const checkInDate = dayjs(checkIn);
        const checkOutDate = dayjs(checkOut);
        const diffDays = checkOutDate.diff(checkInDate, 'day');

        if (diffDays <= 0) return null;

        let totalPrice = 0;
        let currentDate = checkInDate;

        // Iterate through each day of the stay
        for (let i = 0; i < diffDays; i++) {
            // Check if the current day is a weekend (Saturday or Sunday or Friday)
            const isWeekend = currentDate.day() === 0 || currentDate.day() === 6 || currentDate.day() === 5;
            totalPrice += isWeekend ? camptype.weekendRate : camptype.price;
            currentDate = currentDate.add(1, 'day');
        }

        // Multiply by the selected quantity
        return totalPrice * (quantities[camptype.id] || 1);
    };

    const refreshDates = () => {
        const newCheckIn = localStorage.getItem('checkInDate') || '';
        const newCheckOut = localStorage.getItem('checkOutDate') || '';
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
        setCurrentPage(0);
    };

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const ratingsData = await fetchRatingByCampsiteId(campsiteId, 0, 100);
                console.log(ratingsData)
                setRatings(ratingsData);
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        if (campsiteId) {
            fetchRatings();
        }
    }, [campsiteId]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const campsiteData = await fetchCampsiteById(campsiteId);
                if (campsiteData && campsiteData.length > 0) {
                    setCampsite(campsiteData[0]);
                } else {
                    setCampsite([]);
                }
                console.log(campsiteData)

                const params = {
                    campSiteId: campsiteId,
                    ...(checkIn && { checkIn }),
                    ...(checkOut && { checkOut })
                };

                let camptypesData = [];
                let response;

                if (checkIn && checkOut) {
                    response = await fetchCamptypeByIdWithDate({
                        campSiteId: campsiteId,
                        checkIn,
                        checkOut,
                        page: currentPage,
                        size: pageSize
                    });
                } else {
                    response = await fetchCamptypeById(campsiteId, currentPage, pageSize);
                }

                camptypesData = response.content || [];
                setTotalPages(response.totalPages);

                setCamptypes(camptypesData);
                console.log(camptypesData)

                const initialQuantities = {};
                camptypesData.forEach(camptype => {
                    initialQuantities[camptype.id] = 1;
                });

                setQuantities(initialQuantities);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [campsiteId, checkIn, checkOut, currentPage, pageSize]);

    const handleQuantityChange = (id, value, availableSlot) => {
        if (availableSlot) {
            const newValue = Math.max(1, Math.min(availableSlot, Number(value)));
            setQuantities(prev => ({ ...prev, [id]: newValue }));
        } else {
            toast.info('Please select check-in and check-out dates first');
        }
    };

    const handleCamptypeSelection = (camptype) => {
        if (user) {
            const checkInAt = localStorage.getItem('checkInDate')
            const checkOutAt = localStorage.getItem('checkOutDate')

            if (!checkInAt || !checkOutAt) {
                toast.info('Please select check-in and check-out dates first');
                return;
            }
            if (booking.campSiteId && booking.campSiteId !== campsiteId) {
                setPendingSelection(camptype);
                setModalOpen(true);
                return;
            } else {
                proceedWithSelection(camptype);
                updateDatesBookingSummary(checkInAt, checkOutAt);
            }
        } else {
            toast.info('Please login to continue');
        }
    }

    const proceedWithSelection = (camptype) => {
        updateCampsite(campsiteId);
        updateCamptype(camptype.id, quantities[camptype.id]);
        navigate(`/campsite/${campsiteId}/extra-service`);
    };

    const handleConfirmNewSelection = () => {
        setModalOpen(false);
        resetBooking();
        proceedWithSelection(pendingSelection);
    };

    // Calculate nights between check-in and check-out
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = dayjs(checkIn);
        const checkOutDate = dayjs(checkOut);
        return checkOutDate.diff(checkInDate, 'day');
    };

    // Check if the date range includes weekends
    const hasWeekends = () => {
        if (!checkIn || !checkOut) return false;

        const checkInDate = dayjs(checkIn);
        const checkOutDate = dayjs(checkOut);
        let currentDate = checkInDate;

        while (currentDate.isBefore(checkOutDate)) {
            if (currentDate.day() === 0 || currentDate.day() === 6) {
                return true;
            }
            currentDate = currentDate.add(1, 'day');
        }

        return false;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container mx-auto pt-14 min-h-screen overflow-visible'>
            {campsite.imageList && campsite.imageList.length > 0 && (
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    loop={true}
                    centeredSlides={true}
                    slidesPerView={2.5}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    className="w-full h-[500px] flex items-center overflow-visible"
                >
                    {campsite.imageList.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image.path}
                                alt={`Campsite image ${index + 1}`}
                                className="w-full h-[500px] object-cover mx-auto"
                            />
                        </SwiperSlide>
                    ))}
                    {campsite.imageList.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image.path}
                                alt={`Campsite image ${index + 1}`}
                                className="w-full h-[500px] object-cover mx-auto"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
            <div className='pt-6'>
                <p className='w-1/2 font-canto text-3xl pb-6'>{campsite.name}</p>
                <p className='pb-10 font-canto w-1/2'>
                    {isExpanded || campsite.description.length <= maxDescriptionLength
                        ? campsite.description
                        : `${campsite.description.slice(0, maxDescriptionLength)}...`}
                    {campsite.description.length > maxDescriptionLength && (
                        <button
                            onClick={toggleDescription}
                            className="underline ml-2"
                        >
                            {isExpanded ? "Show less" : "More"}
                        </button>
                    )}
                </p>
            </div>
            <p className='text-5xl font-canto'>Select accomodation</p>
            <div className='w-full flex justify-center items-center'>
                <div className='w-1/2'>
                    <SearchBar onSearch={refreshDates} />
                </div>
            </div>
            <div className="mb-16 relative">
                <div className='flex justify-between items-center pb-2'>
                    <h2 className="font-canto text-3xl">
                        Campsite Amenities
                    </h2>
                    <button
                        className='bg-transparent border border-purple-900 text-purple-900 hover:bg-purple-900 
                        hover:text-white px-8 py-3 transform transition duration-300 font-canto text-lg'
                        onClick={() => navigate('/messages', {
                            state: {
                                newChat: true,
                                recipientId: campsite?.user.id,
                                recipientName: campsite?.user.firstname,
                                recipientEmail: campsite?.user.email
                            }
                        })}
                    >
                        <p>Contact Property</p>
                    </button>
                </div>
                <hr />
                <div className="flex overflow-x-auto scrollbar-hide space-x-6 px-4 justify-items-center">
                    {campsite?.campSiteUtilityList.map((utility, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-64"
                        >
                            <div className="group relative p-6 h-full items-center">
                                <div className="flex flex-col items-center h-full">
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={utility.imagePath}
                                            alt={utility.name}
                                            className="w-20 h-20 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-center font-canto text-xl">
                                        {utility.name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='' />
            {camptypes.length === 0 ?
                (<>
                    <p className="text-gray-500 text-center mt-8">No available camp types at the moment.</p>
                </>)
                :
                (<>
                    {camptypes.map(camptype => (
                        <div key={camptype.id} className=''>
                            <div className='flex gap-12 pt-8 pb-16 px-8'>
                                <div className='left-container w-1/3'>
                                    <img src={camptype.image} alt={camptype.type} />
                                </div>
                                <div className='middle-container w-1/2'>
                                    <p className='font-canto text-4xl pb-8'>{camptype.type}</p>
                                    <p className='text-purple-900 uppercase font-serif tracking-tight pb-4'>Description</p>
                                    <p className='text-gray-500 font-light text-xl'>{camptype.type} available in all Astroglampé {campsite.name} lodges.</p>
                                </div>
                                <div className="right-container w-1/6">
                                    <p className="text-gray-500 font-light">Max guests: {camptype.capacity}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <label className="text-gray-700">Qty:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={quantities[camptype.id] || 1}
                                            onChange={e => handleQuantityChange(camptype.id, e.target.value, camptype.availableSlot)}
                                            className="w-16 border border-gray-400 rounded px-2 text-center"
                                        />
                                    </div>
                                    <p className="text-gray-500 font-light pt-3">
                                        {camptype.availableSlot !== null
                                            ? `Available slot(s): ${camptype.availableSlot}`
                                            : "Enter dates to view availability"}
                                    </p>
                                </div>
                            </div>
                            <div className='price-container rounded-md bg-blue-50 mx-8 flex justify-between p-8'>
                                <div className='flex flex-col items-start justify-center'>
                                    <p className='font-canto text-2xl'>Best Flexible Rate</p>
                                    
                                    {/* Display pricing breakdown */}
                                    {checkIn && checkOut && (
                                        <div className="mt-2 text-lg font-canto text-gray-600 w-full">
                                            <div className="grid grid-cols-2 gap-2">
                                                <p className="text-left">Regular rate:</p>
                                                <p className="text-left text-purple-900">{camptype.price.toLocaleString("vi-VN")} VND/night</p>

                                                <p className="text-left">Weekend rate:</p>
                                                <p className="text-left text-purple-900">{camptype.weekendRate.toLocaleString("vi-VN")} VND/night</p>

                                                <p className="text-left">Stay duration:</p>
                                                <p className="text-left text-purple-900">{calculateNights()} night(s)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className='bg-white flex items-center gap-6 p-4 rounded-xl border border-purple-100'>
                                    {camptype.availableSlot > 0 ? (
                                        <>
                                            {calculateTotalPrice(camptype) ? (
                                                <div className="flex flex-col font-canto text-xl">
                                                    <p className='tracking-wide text-purple-900'>
                                                        Total: {calculateTotalPrice(camptype).toLocaleString("vi-VN")} VND
                                                    </p>
                                                    <p className="text-lg text-gray-500">
                                                        For {calculateNights()} night(s) × {quantities[camptype.id] || 1} {quantities[camptype.id] > 1 ? 'rooms' : 'room'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className='tracking-wide text-purple-900'>
                                                    Price per night: {camptype.price.toLocaleString("vi-VN")} VND
                                                    {hasWeekends() && (
                                                        <span className="block text-xs text-gray-500">
                                                            Weekend: {camptype.weekendRate.toLocaleString("vi-VN")} VND
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                            <button
                                                className='bg-transparent border border-purple-900 text-purple-900 hover:bg-purple-900 
                                                hover:text-white rounded-full px-8 py-4 transform transition duration-300 font-canto text-xl'
                                                onClick={() => handleCamptypeSelection(camptype)}
                                            >
                                                <p>Reservation Inquiry</p>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className='tracking-wide text-purple-900 font-canto text-lg'>No availability for the selected dates, please change dates.</p>
                                        </>
                                    )}
                                </div>

                            </div>
                            <hr className='mt-6' />
                        </div>
                    ))}
                    {camptypes.length > 0 && (
                        <div className="flex justify-center gap-4 my-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                            >
                                Previous
                            </button>

                            <span className="px-4 py-2">
                                Page {currentPage + 1} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>)
            }

            <div className="mb-10">
                <p className='text-3xl font-canto mb-6'>Guest Reviews</p>
                <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-4">
                    {/* Average Rating Card */}
                    <div className="flex-shrink-0 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl font-bold text-purple-900">{ratings.averageRating}</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>
                                        {i < Math.floor(ratings.averageRating) ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600">Average Rating</p>
                    </div>

                    {/* Individual Reviews */}
                    {ratings.ratingResponseList?.map((review, index) => (
                        <div key={index} className="flex-shrink-0 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600">{review.userName?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-400">
                                {dayjs(review.uploadTime).format('MMM D, YYYY')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <p className='text-3xl font-canto my-6'>Map View</p>
            <iframe
                width="100%"
                height="450"
                className='mb-10'
                src={googleMapUrl}
                allowFullScreen
            ></iframe>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="">
                    <p>You have already selected a camp type from another campsite. If you proceed, your previous selection will be lost.</p>
                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-purple-900 text-white rounded"
                            onClick={handleConfirmNewSelection}
                        >
                            Yes, Proceed
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CamptypePage