import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const ListingEditor = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [campsite, setCampsite] = useState({});
    const [activeSection, setActiveSection] = useState("photo");
    const googleMapUrl = `https://www.google.com/maps?q=${campsite.latitude},${campsite.longitude}&hl=es;z=14&output=embed`;

    const handleClick = (section) => {
        setActiveSection(section); // Update active state
        navigate(`/hosting/listings/editor/${id}/details/${section}`);
    };
    // Call api campsite by id
    useEffect(() => {
        const fetchCampsiteDetails = async () => {
            setLoading(true);
            try {
                console.log('Fetching campsite with ID:', id);
                const response = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: { id: id }
                });
                setCampsite(response.data.data.content[0]);
            } catch (error) {
                console.error('Error fetching campsite data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCampsiteDetails();
    }, [id]);

    useEffect(() => {
        console.log(campsite);
    }, [campsite]);
    return (
        <div className='flex flex-col h-screen'>
            <div className='flex items-center'>
                <button
                    className='w-10 h-10 flex items-center justify-center text-xl text-black bg-gray-100 rounded-full'
                    onClick={() => navigate('/hosting/listings')}
                >
                    <ArrowBackIcon fontSize="small" />
                </button>
                <h1 className='py-1 pl-8 text-3xl font-semibold'>Listing Editor</h1>
            </div>
            <div className='flex-1 overflow-auto space-y-4 mt-4 px-10 pb-20'>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "photo" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("photo")}
                >
                    <div className='mb-4'>
                        <h1 className="text-xl">Photo</h1>
                        <h2 className="text-xl font-semibold text-gray-400">{campsite.imageList?.length} photo</h2>
                    </div>
                    <div className="relative w-40 h-40 mx-auto rounded-2xl">
                        <img
                            src={campsite.imageList?.[0]?.path}
                            alt="Campsite"
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl z-20 shadow-xl"
                        />
                        <img
                            src={campsite.imageList?.[1]?.path}
                            alt="Campsite"
                            className="absolute top-6 right-1/2 -translate-x-5 -rotate-2 w-32 h-32 object-cover rounded-2xl z-10 shadow-xl"
                        />
                        <img
                            src={campsite.imageList?.[2]?.path}
                            alt="Campsite"
                            className="absolute top-6 left-1/2 translate-x-5 rotate-2 w-32 h-32 object-cover rounded-2xl z-0 shadow-xl"
                        />
                    </div>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "title" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("title")}
                >
                    <h1 className='text-xl'>Title</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.name}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "description" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("description")}
                >
                    <h1 className='text-xl'>Description</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.description}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "place-type" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("place-type")}
                >
                    <h1 className='text-xl'>Place type</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.campSitePlaceTypeList?.map((placeType) => placeType.name).join(", ")}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "amenities" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("amenities")}
                >
                    <h1 className='text-xl'>Amenities</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.campSiteUtilityList?.map((utility) => utility.name).join(", ")}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "location" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("location")}
                >
                    <h1 className='text-xl'>Location</h1>
                    <iframe
                        width="100%"
                        height="300"
                        className='rounded-lg my-2'
                        src={googleMapUrl}
                        allowFullScreen
                    />
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.address}, {campsite.city}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "service" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("service")}
                >
                    <h1 className='text-xl'>Service</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.campSiteSelectionsList?.map((service) => service.name).join(", ")}</h1>
                </div>
                <div
                    className={`rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100 
                        ${activeSection === "camp-type" ? 'border border-black' : 'border border-gray-300'}`}
                    onClick={() => handleClick("camp-type")}
                >
                    <h1 className='text-xl'>Camp Type</h1>
                    <h1 className='text-xl font-semibold text-gray-400'>{campsite.campSiteCampTypeList?.map((type) => type.type).join(", ")}</h1>
                </div>
            </div>
        </div>
    )
}

export default ListingEditor