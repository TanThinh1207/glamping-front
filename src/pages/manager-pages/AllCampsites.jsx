import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const AllCampsites = () => {
    const [campsites, setCampsites] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCampsite, setSelectedCampsite] = useState(null);
    const modalRef = useRef(null);
    const googleMapUrl = `https://www.google.com/maps?q=${selectedCampsite?.latitude},${selectedCampsite?.longitude}&hl=es;z=14&output=embed`;

    useEffect(() => {
        const fetchCampsites = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setCampsites(response.data.data.content);
            } catch (error) {
                console.error('Error fetching campsites:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampsites();
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseModal = () => {
        setSelectedCampsite(null);
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'text-green-500';
            case 'Pending':
                return 'text-orange-500';
            default:
                return 'text-red-500';
        }
    }
    // Format VND
    const formatVND = (price) => {
        const numPrice = Number(price);
        return !isNaN(numPrice)
            ? numPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            : "Invalid price";
    };
    return (
        <div className='w-full h-screen px-20 py-4'>
            <h1 className='text-4xl font-semibold py-8'>All Campsites</h1>
            {loading ? (
                <div className='flex justify-center items-center h-64 w-full'>
                    <div className='animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16'></div>
                </div>
            ) : (
                <>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b-2 border-gray-300'>
                                <th className='text-left py-4'>Campsite</th>
                                <th className='text-left py-4'>Location</th>
                                <th className='text-center py-4'>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {campsites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((campsite) => (
                                <tr
                                    key={campsite.id}
                                    className='cursor-pointer hover:bg-gray-200 group'
                                    onClick={() => setSelectedCampsite(campsite)}
                                >
                                    <td className='p-4 flex items-center gap-5'>
                                        <img src={campsite.imageList[0]?.path} alt={campsite.name} className='w-12 h-12 rounded-md object-cover' />
                                        {campsite.name}
                                    </td>
                                    <td className='py-4'>{campsite.city}</td>
                                    <td className={`text-center py-4 font-bold ${statusColor(campsite.status)}`}>{campsite.status}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <TablePagination
                        component='div'
                        count={campsites.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        className='p-4'
                    />
                </>
            )}
            {selectedCampsite && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div ref={modalRef} className='bg-white shadow-md w-3/5 h-4/5 relative rounded-xl flex flex-col'>
                        <button
                            className="absolute top-1 right-1 text-xl p-2"
                            onClick={handleCloseModal}
                        >
                            ✖
                        </button>
                        <div className='flex w-full h-full'>
                            <div className='relative w-1/2 h-full overflow-y-auto'>
                                <div className='absolute bg-black bg-opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg'>
                                    {selectedCampsite.name}
                                </div>
                                <img src={selectedCampsite.imageList[0].path} alt='campsite' className='w-auto h-full object-cover rounded-l-xl' />
                            </div>
                            <div className='w-1/2 h-full flex flex-col'>
                                <div className='flex-1 overflow-y-auto p-4 mt-5'>
                                    <h1 className='text-xl font-semibold'>Description</h1>
                                    <p className='text-gray-500'>{selectedCampsite.description}</p>

                                    <h1 className='text-xl font-semibold mt-2'>Location</h1>
                                    <iframe width="100%" height="200" className='rounded-lg my-2' src={googleMapUrl} allowFullScreen />
                                    <h1 className='font-semibold text-gray-500'>{selectedCampsite.address}, {selectedCampsite.city}</h1>

                                    <h1 className='text-xl font-semibold mt-2'>Place type</h1>
                                    <p className='text-gray-500'>{selectedCampsite.campSitePlaceTypeList.map((placeType) => placeType.name).join(", ")}</p>

                                    <h1 className='text-xl font-semibold mt-2'>Amenities</h1>
                                    <p className='text-gray-500'>{selectedCampsite.campSiteUtilityList.map((utility) => utility.name).join(", ")}</p>

                                    <h1 className='text-xl font-semibold mt-2'>Camp Type</h1>
                                    {selectedCampsite.campSiteCampTypeList.map((type) => (
                                        <div key={type.id} className='flex  mt-2'>
                                            <div className='relative'>
                                                <div className='absolute bg-black bg-opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg'>
                                                    {type.type} - {type.capacity} guests
                                                </div>
                                                <img src={type.image} className='w-32 h-32 object-cover rounded-lg' />
                                            </div>
                                            <div className='flex flex-col justify-center ml-4'>
                                                <h1 className='text-3xl font-bold'>x {type.quantity}</h1>
                                            </div>
                                            <div className='flex flex-col justify-center ml-4'>
                                                <h1 className='text-xl font-semibold'>Price: {formatVND(type.price)}</h1>
                                                <h1 className='text-gray-500'>Weekend rate: {formatVND(type.weekendRate)}</h1>
                                            </div>
                                        </div>
                                    ))}

                                    <h1 className='text-xl font-semibold mt-2'>Service</h1>
                                    {selectedCampsite.campSiteSelectionsList.map((service) => (
                                        <div key={service.id} className='flex items-center mt-2'>
                                            <div className='relative'>
                                                <div className='absolute bg-black bg-opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg'>
                                                    {service.name}
                                                </div>
                                                <img src={service.image} className='w-32 h-32 object-cover rounded-lg' />
                                            </div>
                                            <div className='flex flex-col justify-center ml-4'>
                                                <h1 className='text-xl font-semibold'>Price: {formatVND(service.price)}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCampsites;
