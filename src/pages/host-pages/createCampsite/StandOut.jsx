import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useCampsite } from '../../../context/CampsiteContext';

const StandOut = () => {
    const {campsiteData, updateCampsiteData} = useCampsite();
    const [selectedUtilities, setSelectedUtilities] = useState(campsiteData.campsiteUtilities || []);
    const [selectedTypes, setSelectedTypes] = useState(campsiteData.campsiteType || []);
    const [selectedImages, setSelectedImages] = useState(
        Array.isArray(campsiteData.campsitePhoto) ? campsiteData.campsitePhoto.filter(Boolean) : []
      );

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
    const listTypes = [
        "mountain",
        "beach",
        "forest",
        "lake",
        "desert",
        "river",
        "island",
        "cave",
        "countryside",
        "city",
    ];
   

    const toggleUtility = (utility) => {
        setSelectedUtilities((prevSelected) => {
            const updatedUtilities = prevSelected.includes(utility)
                ? prevSelected.filter((item) => item !== utility)
                : [...prevSelected, utility];

            updateCampsiteData("campsiteUtilities", updatedUtilities); 
            return updatedUtilities;
        });
    };
    const toggleType = (type) => {
        setSelectedTypes((prevSelected) => {
            const updatedTypes = prevSelected.includes(type)
                ? prevSelected.filter((item) => item !== type)
                : [...prevSelected, type];

            updateCampsiteData("campsiteType", updatedTypes); 
            return updatedTypes;
        });
    };
    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            ).filter(Boolean);
            setSelectedImages((prevImages) => {
                const updatedImages = [...prevImages, ...newImages];
                updateCampsiteData("campsitePhoto", updatedImages);
                return updatedImages;
            });
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
                    {listTypes.map((type) => (
                        <div
                            key={type}
                            className={`border-2 rounded-2xl p-2 cursor-pointer transition ${
                                selectedTypes.includes(type)
                                    ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                                    : 'border-gray-300'
                            }`}
                            onClick={() => toggleType(type)}
                        >
                            {type}
                        </div>
                    ))}
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
                                ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
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