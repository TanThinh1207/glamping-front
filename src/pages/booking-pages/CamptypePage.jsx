import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { useBooking } from '../../context/BookingContext'
import { fetchCampsiteById, fetchCamptypeById } from '../../service/BookingService'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/Modal'

const CamptypePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { updateCamptype, updateCampsite, resetBooking, booking } = useBooking();
    const { campsiteId } = useParams();

    const [campsite, setCampsite] = useState(null);
    const [camptypes, setCamptypes] = useState([]);
    const [quantities, setQuantities] = useState({});

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingSelection, setPendingSelection] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const campsiteData = await fetchCampsiteById(campsiteId);
                const camptypesData = await fetchCamptypeById(campsiteId);
                setCampsite(campsiteData);
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
    }, [campsiteId]);

    const handleQuantityChange = (id, value) => {
        const newValue = Math.max(1, Math.min(10, Number(value)));
        setQuantities(prev => ({ ...prev, [id]: newValue }));
    };

    const handleCamptypeSelection = (camptype) => {
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
        <div className='container mx-auto pt-20 min-h-screen'>
            <p className='text-gray-500 text-xl pb-4'>{campsite.name}</p>
            <p className='text-5xl font-canto'>Select accomodation</p>
            <SearchBar />
            <hr className='mt-10' />
            {camptypes.map(camptype => (
                <div key={camptype.id} className=''>
                    <div className='flex gap-12 pt-10 pb-16 px-8'>
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
                                    onChange={e => handleQuantityChange(camptype.id, e.target.value)}
                                    className="w-16 border border-gray-400 rounded px-2 text-center"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='price-container rounded-md bg-blue-50 mx-8 flex justify-between p-8'>
                        <div className='flex flex-col items-center justify-center'>
                            <p className='font-canto text-2xl'>Best Flexible Rate</p>
                            <p className='text-gray-500 text-lg pt-3 gap-3'><span className='pr-1'><FontAwesomeIcon icon={faMugHot} /></span>Breakfast included</p>
                        </div>
                        <div className='bg-white flex items-center gap-6 p-4 rounded-xl border border-purple-100'>
                            <p className='tracking-wide text-purple-900'>Price per night: ${camptype.price}</p>
                            <button
                                className='bg-purple-900 text-white rounded-full px-8 py-4'
                                onClick={() => handleCamptypeSelection(camptype)}
                            >
                                <p>Reservation Inquiry</p>
                            </button>
                        </div>
                    </div>
                    <hr className='mt-6' />
                </div>
            ))}
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
