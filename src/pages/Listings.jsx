import React from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../assets/B6D7F1F4-1DB2-4380-94D9-185EF023BE36.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const listInfo = [
    {
        id: 1,
        image: image1,
        title: "Campsite 1",
        location: "Hanoi",
        status: "Active",
    },
    {
        id: 2,
        image: image1,
        title: "Campsite 2",
        location: "Ho Chi Minh",
        status: "Pending",
    },
    {
        id: 3,
        image: image1,
        title: "Campsite 3",
        location: "Hanoi",
        status: "Pending",
    }
];
const Listings = () => {
    const statusColor = (status) => {
        if (status === "Pending") {
            return "text-orange-500";
        } else {
            return "text-green-500";
        }
    }
    const navigate = useNavigate();
    return (
        <div className="w-full h-screen bg-white px-20 py-4">
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
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr >
                            <th className="text-left p-4">Listing</th>
                            <th className="text-left p-4">Location</th>
                            <th className="text-left p-4">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listInfo.map((listing) => (
                            <tr
                                key={listing.id}
                                className="cursor-pointer hover:bg-gray-100 group"
                                onClick={() => navigate(`/hosting/editor/${listing.id}`)}
                            >
                                <td className="p-4 flex items-center gap-3">
                                    <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-md object-cover" />
                                    {listing.title}
                                </td>
                                <td className="p-4">{listing.location}</td>
                                <td className="p-4 ">
                                    <span className={`px-2 py-1 rounded-md ${statusColor(listing.status)}`}>
                                        {listing.status}
                                    </span>
                                </td>
                                <td>
                                    <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Listings;
