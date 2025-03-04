import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useCampsite } from '../../../context/CampsiteContext';
import axios from 'axios';

const StandOut = () => {
    const [placeTypes, setPlaceTypes] = useState([]);
    const [utilities, setUtilities] = useState([]);
    const { campsiteData, updateCampsiteData } = useCampsite();
    const [selectedUtilities, setSelectedUtilities] = useState(campsiteData.campsiteUtilities || []);
    const [selectedTypes, setSelectedTypes] = useState(campsiteData.campsiteType || []);
    const [selectedImages, setSelectedImages] = useState(
        Array.isArray(campsiteData.campsitePhoto) ? campsiteData.campsitePhoto.filter(Boolean) : []
    );
    useEffect(() => {
        updateCampsiteData("campsiteUtilities", selectedUtilities);
    }, [selectedUtilities]);

    useEffect(() => {
        updateCampsiteData("campsiteType", selectedTypes);
    }, [selectedTypes]);

    useEffect(() => {
        updateCampsiteData("campsitePhoto", selectedImages);
    }, [selectedImages]);

    useEffect(() => {
        const fetchUtilities = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_GET_UTILITIES}`, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setUtilities(response.data.data.content);
          } catch (error) {
            console.error("Error fetching utilities data:", error);
          }
        };
        fetchUtilities();
      }, []);

    useEffect(() => {
        const fetchPlaceTypes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_GET_PLACETYPES}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setPlaceTypes(response.data.data.content);
            } catch (error) {
                console.error("Error fetching place type data:", error);
            }
        };
        fetchPlaceTypes();
    }, []);


    const toggleUtility = (utilityId) => {
        setSelectedUtilities((prev) => {
            return prev.includes(utilityId)
                ? prev.filter((id) => id !== utilityId)
                : [...prev, utilityId];
        });
    };
    
    const toggleType = (typeId) => {
        setSelectedTypes((prev) => {
            return prev.includes(typeId)
                ? prev.filter((id) => id !== typeId)
                : [...prev, typeId];
        });
    };
    
    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            ).filter(Boolean);
            setSelectedImages((prevImages) => [...prevImages, ...newImages]);
        }
    };
    return (
        <div className='w-full  bg-white py-24 px-96'>
            <div className='mb-8'>
                <h1 className='text-4xl font-semibold'>
                    Add some photos of your campsite
                </h1>
                <div className='flex gap-4 flex-wrap mt-5'>
                    {selectedImages.filter(Boolean).map((image, index) => (
                        <div key={index} className='relative w-32 h-32'>
                            <img
                                src={image}
                                alt={`Uploaded ${index}`}
                                className='w-full h-full object-cover rounded-xl'
                            />
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
                    {placeTypes?.map((type) => (
                        <div
                            key={type.id}
                            className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedTypes.includes(type.id)
                                ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'border-gray-300'
                                }`}
                            onClick={() => toggleType(type.id)}
                        >
                            {type.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-8'>
                <h1 className='text-4xl font-semibold'>
                    Tell us about your campsite's utilities
                </h1>
                <div className='flex gap-4 flex-wrap mt-5'>
                    {utilities?.map((utility) => (
                        <div
                            key={utility.id}
                            className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedUtilities.includes(utility.id)
                                ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'border-gray-300'
                                }`}
                            onClick={() => toggleUtility(utility.id)}
                        >
                            {utility.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StandOut