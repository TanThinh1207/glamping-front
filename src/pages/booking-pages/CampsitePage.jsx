import React, { useEffect, useState } from 'react'
import DestinationSearch from '../../components/DestinationSearch'
import CampsiteCard from '../../components/CampsiteCard'
import { fetchAllCampsites } from '../../service/BookingService'
// import antony from '../../assets/antony.gif'
import { useLocation } from 'react-router-dom'

const CampsitePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campsites, setCampsites] = useState([]);
    const location = useLocation();
    const selectedCity = location.state?.selectedCity || '';

    useEffect(() => {
        const fetchCampsites = async () => {
            setLoading(true);
            try {
                const response = await fetchAllCampsites();
                const filteredCampsites = selectedCity
                    ? response.filter(campsite => campsite.city.toLowerCase() === selectedCity.toLowerCase())
                    : response;
                setCampsites(filteredCampsites);
                console.log(response);
            } catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchCampsites();
    }, [selectedCity]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }
    if (error) return <p className='min-h-screen'>Error: {error}</p>;

    return (
        <div className='container mx-auto pt-20 min-h-screen'>
            <p className='text-5xl font-canto'>Campsites {selectedCity && `in ${selectedCity}`}</p>
            <DestinationSearch />
            <hr className='my-10' />
            {campsites.length > 0 ? (
                campsites.map((campsite) => <CampsiteCard key={campsite.id} campsite={campsite} />)
            ) : (
                <p>No campsites found.</p>
            )}
        </div>
    )
}

export default CampsitePage
