import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { TablePagination } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const HandleRequest = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(null);
    const [message, setMessage] = useState('');
    const [campsite, setCampsite] = useState(null);
    const googleMapUrl = `https://www.google.com/maps?q=${campsite?.latitude},${campsite?.longitude}&hl=es;z=14&output=embed`;
    //Handle Click outside of pop-up
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClosePopUp();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    //Table Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [loading, setLoading] = useState(true);

    // Format VND
    const formatVND = (price) => {
        const numPrice = Number(price);
        return !isNaN(numPrice)
            ? numPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
            : "Invalid price";
    };

    // Call api for campsite requests
    const [createCampsiteRequests, setCreateCampsiteRequests] = useState([]);
    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setLoading(true);
                const respone = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        status: 'Pending'
                    }
                });
                console.log(respone.data.data.content);
                setCreateCampsiteRequests(respone.data.data.content);
            } catch (error) {
                console.error('Error fetching campsite requests:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPendingRequests();
    }, []);

    // Set status from pending to Available
    const handleApprove = async (id) => {
        try {
            setLoading(true);
            await axios.patch(
                `${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`,
                { status: 'Available' },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCreateCampsiteRequests(createCampsiteRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Error approving request:', error);
        } finally {
            setLoading(false);
        }
    };

    // 
    const handleReject = async (id) => {
        try {
            setLoading(true);
            await axios.patch(
                `${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`,
                { status: 'Denied', message: message },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCreateCampsiteRequests(createCampsiteRequests.filter(request => request.id !== id));
            handleClosePopUp();
        } catch (error) {
            console.error('Error rejecting request:', error);
        } finally {
            setLoading(false);
        }
    };

    // handle status color
    const statusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-orange-500';
            case 'Available':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    // Handle close pop-up
    const handleClosePopUp = () => {
        setIsOpen(false);
        setId(null);
        setMessage('');
        setCampsite(null);
    };

    const handleCloseModal = () => {
        setCampsite(null);
    };

    useEffect(() => {
        console.log(campsite);
    }, [campsite]);
    return (
        <div className='w-full h-screen px-20 py-4'>
            <div>
                <h1 className='text-4xl font-semibold py-8'>Request</h1>
            </div>
            <div>
                {loading ? (
                    <div className="flex justify-center items-center h-64 w-full">
                        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
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
                                {createCampsiteRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
                                    <tr
                                        key={request.id}
                                        className="cursor-pointer hover:bg-gray-200 group"
                                        onClick={() => setCampsite(request)}
                                    >
                                        <td className="p-4 flex items-center gap-5">
                                            <img src={request.imageList[0]?.path} alt={request.name} className="w-12 h-12 rounded-md object-cover" />
                                            {request.name}
                                        </td>
                                        <td className='py-4'>{request.city}</td>
                                        <td className={`py-4 font-bold text-center ${statusColor(request.status)}`}>{request.status}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <TablePagination
                            component="div"
                            count={createCampsiteRequests.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                            className='p-4'
                        />
                    </>
                )}
                {campsite && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                        <div ref={modalRef} className='bg-white shadow-md w-3/5 h-4/5 relative rounded-xl flex flex-col'>
                            <button
                                className="absolute -top-2 -right-2 bg-red-500 text-xl p-1 rounded-full"
                                onClick={handleCloseModal}
                            >
                                ✖
                            </button>
                            <div className='flex w-full h-full'>
                                <div className='relative w-1/2 h-full overflow-y-auto'>
                                    <div className='absolute bg-black bg-opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg'>
                                        {campsite.name}
                                    </div>
                                    <img src={campsite.imageList[0].path} alt='campsite' className='w-auto h-full object-cover rounded-l-xl' />
                                </div>
                                <div className='w-1/2 h-full flex flex-col'>
                                    <div className='flex-1 overflow-y-auto p-4'>
                                        <h1 className='text-xl font-semibold'>Description</h1>
                                        <p className='text-gray-500'>{campsite.description}</p>

                                        <h1 className='text-xl font-semibold mt-2'>Location</h1>
                                        <iframe width="100%" height="200" className='rounded-lg my-2' src={googleMapUrl} allowFullScreen />
                                        <h1 className='font-semibold text-gray-500'>{campsite.address}, {campsite.city}</h1>

                                        <h1 className='text-xl font-semibold mt-2'>Place type</h1>
                                        <p className='text-gray-500'>{campsite.campSitePlaceTypeList.map((placeType) => placeType.name).join(", ")}</p>

                                        <h1 className='text-xl font-semibold mt-2'>Amenities</h1>
                                        <p className='text-gray-500'>{campsite.campSiteUtilityList.map((utility) => utility.name).join(", ")}</p>

                                        <h1 className='text-xl font-semibold mt-2'>Camp Type</h1>
                                        {campsite.campSiteCampTypeList.map((type) => (
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
                                        {campsite.campSiteSelectionsList.map((service) => (
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
                                    <div className='p-2 flex justify-end space-x-4 bg-white sticky bottom-0 border-t'>
                                        <button className='bg-green-500 text-white rounded-md px-4 py-2' onClick={() => handleApprove(campsite.id)}>
                                            Approve
                                        </button>
                                        <button className='bg-red-500 text-white rounded-md px-4 py-2' onClick={() => { setIsOpen(true); setId(campsite.id); }}>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
                        <h1 className='text-4xl font-bold mb-4'>Why do you reject campsite</h1>
                        <textarea
                            className='w-full h-32 border-2 rounded-xl border-gray-200 p-2'
                            placeholder='Enter your reason'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className='text-right mt-4'>
                            <button
                                className='bg-red-500 text-white rounded-md px-4 py-2'
                                onClick={() => handleReject(id)}
                            >
                                Reject
                            </button>
                            <button
                                className='bg-white text-black border border-black text-semibold rounded-md px-4 py-2 ml-4'
                                onClick={handleClosePopUp}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HandleRequest
