import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

const CampsiteCard = ({ campsite }) => {
    const navigate = useNavigate();
    const { updateCampsite } = useBooking();

    // const lat = campsite.latitude;
    // const lon = campsite.longitude;
    // fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    //     .then(response => response.json())
    //     .then(data => console.log(data.address.state || data.address.city))
    //     .catch(err => console.error('Error:', err));

    const handleDiscover = () => {
        // const campsiteLocationPath = encodeURIComponent(campsite.city.toLowerCase().replace(/\s+/g, '-'));
        updateCampsite(campsite.id);
        navigate(`/campsite/${campsite.id}`);
    };
    return (
        <div className='flex flex-col md:flex-row gap-10 pb-16'>
            <div className='left-container md:w-1/2 w-full'>
                <img src={campsite.image} alt={campsite.name} />
            </div>
            <div className='right-container md:w-1/2 w-full'>
                <p className='uppercase text-lg text-gray-500 font-serif pb-6'>{campsite.location}</p>
                <p className='text-5xl font-canto pb-8'>{campsite.name}</p>
                <p className='font-serif tracking-wide text-gray-700'>{campsite.description}</p>
                <button className='bg-gray-800 text-white tracking-tight font-semibold 
                uppercase px-10 py-4 mt-6 mr-2 rounded-full transition-colors duration-300 hover:bg-gray-500'
                    onClick={handleDiscover}
                >
                    Discover
                </button>
            </div>
        </div>
    )
}

export default CampsiteCard
