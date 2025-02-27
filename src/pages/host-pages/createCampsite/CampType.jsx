import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';

const CampType = () => {
  const { campsiteData, updateCampsiteData } = useCampsite();
  const [addedCampTypes, setAddedCampTypes] = useState(
    Array.isArray(campsiteData.campType) ? campsiteData.campType : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campPrice, setCampPrice] = useState('');
  const [campImage, setCampImage] = useState(null);
  const modalRef = useRef(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const listFacilities = [
    "Wifi", "Parking", "Toilet", "Swimming Pool", "Kitchen", "Shower", "Laundry",
    "Water", "Electricity", "Fireplace", "BBQ", "Pet Friendly", "Kid Friendly"
  ];

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

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((item) => item !== facility) : [...prev, facility]
    );
  };

  const handleAddCampType = () => {
    if (campName && campDesc && campPrice) {
      const newCampType = {
        name: campName,
        description: campDesc,
        price: campPrice,
        image: campImage,
        facilities: selectedFacilities,
      };
      setAddedCampTypes((prevCampTypes) => {
        const updatedCampTypes = [...prevCampTypes, newCampType];
        updateCampsiteData('campType', updatedCampTypes);
        return updatedCampTypes;
      });
      handleClosePopUp();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCampImage(URL.createObjectURL(file));
    }
  };

  const handleClosePopUp = () => {
    setIsOpen(false);
    setCampName('');
    setCampDesc('');
    setCampPrice('');
    setCampImage(null);
    setSelectedFacilities([]);
  };

  return (
    <div className='w-full bg-white py-24 px-96'>
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold'>What types of camps do you offer?</h1>
        <h2 className='text-gray-500'>Provide different glamping styles (e.g., safari tents, yurts, cabins, treehouses)</h2>
      </div>
      <div className='flex gap-4 flex-wrap'>
        {addedCampTypes.filter(camp => camp.name).map((camp, index) => (
          <div key={index} className='w-64 border rounded-xl p-4 shadow-lg'>
            {camp.image && <img src={camp.image} alt='Camp' className='w-full h-auto object-cover rounded-xl' />}
            <h3 className='text-lg font-semibold mt-2'>{camp.name}</h3>
            <p className='text-gray-500'>{camp.description}</p>
            <p className='font-bold mt-2'>${camp.price}</p>
            <div className='mt-2 text-sm text-gray-600'>
              {Array.isArray(camp.facilities) ? camp.facilities.join(', ') : 'No facilities'}
            </div>
          </div>
        ))}
        <label className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 mt-5' onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
        </label>
      </div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div className='mb-8 flex flex-col gap-4'>
              <h1 className='text-xl font-semibold'>Camp Type Name</h1>
              <input className='w-full h-10 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter camp type name' value={campName} onChange={(e) => setCampName(e.target.value)} />
              <h1 className='text-xl font-semibold'>Camp Type Image</h1>
              <label className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 ' htmlFor='imageUpload'>
                {campImage ? <img src={campImage} alt='Preview' className='w-full h-full object-cover rounded-xl' /> : <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />}
              </label>
              <input type='file' id='imageUpload' className='hidden' onChange={handleImageUpload} />
              <h1 className='text-xl font-semibold'>Camp Type Description</h1>
              <textarea className='w-full h-32 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter camp type description' value={campDesc} onChange={(e) => setCampDesc(e.target.value)} />
              <h1 className='text-xl font-semibold'>Camp Type Price</h1>
              <input className='w-full h-10 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter camp type price' type='number' value={campPrice} onChange={(e) => setCampPrice(e.target.value)} />
              <h1 className='text-xl font-semibold'>Facilities</h1>
              <div className='flex gap-4 flex-wrap'>
                {listFacilities.map((facility) => (
                  <div key={facility} className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedFacilities.includes(facility) ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white' : 'border-gray-300'}`} onClick={() => toggleFacility(facility)}>
                    {facility}
                  </div>
                ))}
              </div>
            </div>
            <div className='text-right'>
              <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={handleAddCampType}>Add Camp Type</button>
              <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleClosePopUp}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampType;
