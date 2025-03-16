import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { TablePagination } from '@mui/material'

const HandleRequest = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(null);
    const [message, setMessage] = useState('');

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
    }
    return (
        <div className='w-full h-screen bg-white px-20 py-4'>
            <div>
                <h1 className='text-4xl font-semibold py-8'>Request</h1>
            </div>
            <div>
                {loading ? (
                    <div className="flex justify-center items-center h-64 w-full">
                        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
                    </div>
                ) : (
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b-2 border-gray-300'>
                                <th className='text-left py-4'>Campsite</th>
                                <th className='text-left py-4'>Location</th>
                                <th className='text-center py-4'>Status</th>
                                <th className='text-center py-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {createCampsiteRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
                                <tr key={request.id} className='border-b border-gray-300'>
                                    <td className="p-4 flex items-center gap-5">
                                        <img src={request.imageList[0]?.path} alt={request.name} className="w-12 h-12 rounded-md object-cover" />
                                        {request.name}
                                    </td>
                                    <td className='py-4'>{request.city}</td>
                                    <td className={`py-4 text-center ${statusColor(request.status)}`}>{request.status}</td>
                                    <td className='py-4 text-center space-x-4'>
                                        <button
                                            className='bg-green-500 text-white rounded-md px-4 py-2'
                                            onClick={() => handleApprove(request.id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className='bg-red-500 text-white rounded-md px-4 py-2 '
                                            onClick={() => {
                                                setIsOpen(true);
                                                setId(request.id);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            {!loading && (
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
            )}
        </div>
    )
}

export default HandleRequest
