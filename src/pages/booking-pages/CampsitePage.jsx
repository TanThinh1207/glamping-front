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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchCampsites = async () => {
            setLoading(true);
            try {
                const response = await fetchAllCampsites(currentPage, pageSize);
                let filteredCampsites = response.content;

                if (selectedCity) {
                    filteredCampsites = response.content.filter(campsite =>
                        campsite.city.toLowerCase() === selectedCity.toLowerCase()
                    );
                }

                setCampsites(filteredCampsites);
                setTotalPages(response.totalPages);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCampsites();
    }, [currentPage, pageSize, selectedCity]);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };


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
                <>
                    {campsites.map((campsite) => (
                        <CampsiteCard key={campsite.id} campsite={campsite} />
                    ))}
                    <div className="flex justify-center gap-4 my-8">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                            Previous
                        </button>

                        <span className="px-4 py-2">
                            Page {currentPage + 1} of {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No campsites found.</p>
            )}
        </div>
    )
}

export default CampsitePage
