import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { useBooking } from '../../context/BookingContext'
import { fetchCampsiteById, fetchCamptypeById, fetchCamptypeByIdWithDate } from '../../service/BookingService'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'
import { useUser } from '../../context/UserContext'
import ex1 from '../../assets/thumb.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

    const googleMapUrl = `https://www.google.com/maps?q=${campsite.latitude},${campsite.longitude}&hl=es;z=14&output=embed`;

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };


    const refreshDates = () => {
        const newCheckIn = localStorage.getItem('checkInDate') || '';
        const newCheckOut = localStorage.getItem('checkOutDate') || '';
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
    };

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

                if (checkIn && checkOut) {
                    camptypesData = await fetchCamptypeByIdWithDate(params);
                } else {
                    camptypesData = await fetchCamptypeById(campsiteId);
                }
                if (!Array.isArray(camptypesData)) {
                    camptypesData = [];
                }

                setCamptypes(camptypesData);

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
    }, [campsiteId, checkIn, checkOut]);

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
            <SearchBar onSearch={refreshDates} />
            <div className="mb-16 relative">
                <h2 className="font-canto text-3xl mb-8 pb-4 border-b border-gray-200">
                    Campsite Amenities
                </h2>

                <div className="flex overflow-x-auto scrollbar-hide space-x-6 px-4">
                    {campsite?.campSiteUtilityList.map((utility, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-64"
                        >
                            <div className="group relative p-6 h-full">
                                <div className="flex flex-col items-center h-full">
                                    <div className="flex items-center justify-center">
                                        <img
                                            src={utility.imagePath}
                                            alt={utility.name}
                                            className="w-30 h-30 object-contain"
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
                                <div className='flex flex-col items-center justify-center'>
                                    <p className='font-canto text-2xl'>Best Flexible Rate</p>
                                    <p className='text-gray-500 text-lg pt-3 gap-3'><span className='pr-1'><FontAwesomeIcon icon={faMugHot} /></span>Breakfast included</p>
                                </div>
                                <div className='bg-white flex items-center gap-6 p-4 rounded-xl border border-purple-100'>
                                    {camptype.availableSlot > 0 ? (
                                        <>
                                            <p className='tracking-wide text-purple-900'>Price per night: VND{camptype.price.toLocaleString("vi-VN")}</p>
                                            <button
                                                className='bg-transparent border border-purple-900 text-purple-900 hover:bg-purple-900 
                                            hover:text-white rounded-full px-8 py-4 transform transition duration-300'
                                                onClick={() => handleCamptypeSelection(camptype)}
                                            >
                                                <p>Reservation Inquiry</p>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className='tracking-wide text-purple-900'>No availability for the selected dates, please change dates.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <hr className='mt-6' />
                        </div>
                    ))}
                </>)
            }
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
                            className="px-4 py-2 bg-red-600 text-white rounded"
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
