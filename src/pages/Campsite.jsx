import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { campsites } from './Glamping'
import SearchBar from '../components/SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'

const Campsite = () => {
    const { location } = useParams();
    const [camptypes, setCamptypes] = useState([]);

    const fetchCamptypes = async () => {
        try {
            const response = await fetch(`https://1e9571cd-9582-429d-abfe-167d79882ad7.mock.pstmn.io/camptypes/${location}`);
            const data = await response.json();
            setCamptypes(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCamptypes();
    }, [location]);

    const selectedCampsite = campsites.find(campsite => campsite.location.toLowerCase() === location);

    if (!selectedCampsite) {
        return <h1 className='text-4xl font-bold inset-0 text-center items-center h-screen'>Campsite not found</h1>
    }

    return (
        <div className='container mx-auto pt-20'>
            <p className='text-gray-500 text-xl pb-4'>{selectedCampsite.name}</p>
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
                            <p className='text-gray-500 font-light text-xl'>{camptype.type} available in all Astroglampé {location.charAt(0).toUpperCase() + location.slice(1)} lodges.</p>
                        </div>
                        <div className='right-container w-1/6'>
                            <p className='text-gray-500 font-light'>Max guests: {camptype.capacity}</p>
                        </div>
                    </div>
                    <div className='price-container rounded-md bg-blue-50 mx-8 flex justify-between p-8'>
                        <div className='flex flex-col items-center justify-center'>
                            <p className='font-canto text-2xl'>Best Flexible Rate</p>
                            <p className='text-gray-500 text-lg pt-3 gap-3'><span className='pr-1'><FontAwesomeIcon icon={faMugHot} /></span>Breakfast included</p>
                        </div>
                        <div className='bg-white flex items-center gap-6 p-4 rounded-xl border border-purple-100'>
                            <p className='tracking-wide text-purple-900'>Price per night: ${camptype.price}</p>
                            <p className='bg-purple-900 text-white rounded-full px-8 py-4'>Reservation Inquiry</p>
                        </div>
                    </div>
                    <hr className='mt-6'/>
                </div>
            ))}
        </div>
    )
}

export default Campsite
