import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/SearchBar'
import CampsiteCard from '../../components/CampsiteCard'
import { fetchAllCampsites } from '../../utils/BookingAPI'
// import antony from '../../assets/antony.gif'

const CampsitePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campsites, setCampsites] = useState([]);

    useEffect(() => {
        const fetchCampsites = async () => {
            setLoading(true);
            try {
                const response = await fetchAllCampsites();
                setCampsites(response);
            } catch (error) {
                setError(error.message);
            }

            // setTimeout(() => {
            //     setLoading(false);
            // }, 10000);
            
            finally {
                setLoading(false);
            }
        }
        fetchCampsites();
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
            // <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            //     <img src={antony} alt="Loading..." className="h-30 w-30" />
            // </div>
        );
    }
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container mx-auto pt-20 min-h-screen'>
            <p className='text-5xl font-canto'>Campsites</p>
            <SearchBar />
            <hr className='my-10' />
            {campsites.map(campsite => (
                <CampsiteCard key={campsite.id} campsite={campsite} />
            ))}
        </div>
    )
}

export default CampsitePage
