import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';
import axios from 'axios';

const StandOut = () => {
    const { selectedUtilities, updateSelectedUtilities, selectedPlaceTypes, updateSelectedPlaceTypes } = useCampsite();
    const { campsiteImages, updateCampsiteImages } = useCampsite();
    const [loading, setLoading] = useState(false);


    //Call api for utilities
    const [utilities, setUtilities] = useState([]);
    useEffect(() => {
        const fetchUtilities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_UTILITIES_ENDPOINT}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUtilities(response.data.data.content);
            } catch (error) {
                console.error("Error fetching utilities data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUtilities();
    }, []);

    //Call api for place types
    const [placeTypes, setPlaceTypes] = useState([]);
    useEffect(() => {
        const fetchPlaceTypes = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setPlaceTypes(response.data.data.content);
            } catch (error) {
                console.error("Error fetching place type data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaceTypes();
    }, []);

    //add data to context
    const toggleUtility = (utility) => {
        updateSelectedUtilities(utility)
    };

    const toggleType = (type) => {
        updateSelectedPlaceTypes(type)
    };

    //Image upload
    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            updateCampsiteImages([...campsiteImages, ...newImages]);
        }
    };
    const removeImage = (index) => {
        updateCampsiteImages(campsiteImages.filter((_, i) => i !== index));
    };

    return (
        <div className='w-full  bg-white py-24 px-96'>
            <div className='mb-8'>
                <h1 className='text-4xl font-semibold'>
                    Add some photos of your campsite
                </h1>
                <div className='flex gap-4 flex-wrap mt-5'>
                    {campsiteImages.map((image, index) => (
                        <div key={index} className='relative w-32 h-32'>
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Uploaded ${index}`}
                                className='w-full h-full object-cover rounded-xl'
                            />
                            <button
                                className='absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full'
                                onClick={() => removeImage(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <label
                        className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2'
                    >
                        <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
                        <input
                            type='file'
                            accept='image/*'
                            multiple
                            className='hidden'
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
            </div>
            <div className='mb-8'>
                <h1 className='text-4xl font-semibold'>
                    Tell us about your campsite's type
                </h1>

                <div className='flex gap-4 flex-wrap mt-5'>
                    {loading ? (
                        <div className="flex justify-center items-center h-auto w-full">
                            <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-11 w-11"></div>
                        </div>
                    ) : (
                        <>
                            {placeTypes?.map((type) => (
                                <div
                                    key={type.id}
                                    className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedPlaceTypes.some((item) => item.id === type.id)
                                        ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                                        : 'border-gray-300'
                                        }`}
                                    onClick={() => toggleType({ id: type.id, name: type.name })}
                                >
                                    {type.name}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className='mb-8'>
                <h1 className='text-4xl font-semibold'>
                    Tell us about your campsite's utilities
                </h1>
                <div className='flex gap-4 flex-wrap mt-5'>
                    {loading ? (
                        <div className="flex justify-center items-center h-auto w-full">
                            <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-11 w-11"></div>
                        </div>
                    ) : (
                        <>
                            {utilities?.map((utility) => (
                                <div
                                    key={utility.id}
                                    className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedUtilities.some((item) => item.id === utility.id)
                                        ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                                        : 'border-gray-300'
                                        }`}
                                    onClick={() => toggleUtility({ id: utility.id, name: utility.name })}
                                >
                                    {utility.name}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StandOut