import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const StandOut = () => {
    const listUtilities = [
        "Wifi",
        "Parking",
        "Toilet",
        "Swimming Pool",
        "Kitchen",
        "Shower",
        "Laundry",
        "Water",
        "Electricity",
        "Fireplace",
        "BBQ",
        "Pet Friendly",
        "Kid Friendly",

    ];
    const [selectedUtilities, setSelectedUtilities] = useState([]);

    const toggleUtility = (utility) => {
        setSelectedUtilities((prevSelected) =>
            prevSelected.includes(utility)
                ? prevSelected.filter((item) => item !== utility) // Remove if already selected
                : [...prevSelected, utility] // Add if not selected
        );
    };
    const [selectedImages, setSelectedImages] = useState([]);
    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
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
                    {selectedImages.map((image, index) => (
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
                    Tell us about your campsite's utilities 
                </h1>
                <div className='flex gap-4 flex-wrap mt-5'>
                    {listUtilities.map((utility) => (
                        <div
                        key={utility}
                        className={`border-2 rounded-2xl p-2 cursor-pointer transition ${
                            selectedUtilities.includes(utility)
                                ? 'border-gray-400 bg-gray-300 text-white'
                                : 'border-gray-300'
                        }`}
                        onClick={() => toggleUtility(utility)}
                    >
                        {utility}
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StandOut