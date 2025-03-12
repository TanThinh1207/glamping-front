import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/ex1.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { TablePagination } from '@mui/material';

const Listings = () => {
    const navigate = useNavigate();


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

    //Call api for campsite listings
    const [campsiteList, setCampsiteList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampsiteList = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCampsiteList(response.data.data.content);
            } catch (error) {
                console.error('Error fetching campsite data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampsiteList();
    }, []);

    //Status color
    const statusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-orange-500';
            default:
                return 'text-gray-500';
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <div className="w-full bg-white px-20 py-4 flex-grow">
                <div className='flex justify-between '>
                    <h1 className="text-4xl font-semibold py-8">Your listings</h1>
                    <button
                        className='bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center my-8'
                        onClick={() => navigate(`/hosting/create-campsite/overview`)}
                    >
                        <FontAwesomeIcon icon={faPlus} className='flex items-center justify-center' />
                    </button>
                </div>

                <div className="overflow-x-auto">

                    {loading ? (
                        <div className="flex justify-center items-center h-64 w-full">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr >
                                    <th className="text-left p-4">Listing</th>
                                    <th className="text-left p-4">Location</th>
                                    <th className="text-center p-4">Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {campsiteList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((listing) => (
                                    <tr
                                        key={listing.id}
                                        className="cursor-pointer hover:bg-gray-100 group"
                                        onClick={() => navigate(`/hosting/editor/${listing.id}`)}
                                    >
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={image} alt={listing.name} className="w-12 h-12 rounded-md object-cover" />
                                            {listing.name}
                                        </td>
                                        <td className="p-4">{listing.city}</td>
                                        <td className={`p-4 text-center font-bold ${statusColor(listing.status)}`}>
                                            {listing.status}
                                        </td>
                                        <td>
                                            <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!loading && (
                    <TablePagination
                        component="div"
                        count={campsiteList.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        className='p-4'
                    />
                )}
            </div>
        </div >
    );
};

export default Listings;
