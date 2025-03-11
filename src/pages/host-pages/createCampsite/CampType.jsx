import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';
import axios from 'axios';


const CampType = () => {
  const { campsiteData, updateCampsiteData } = useCampsite();
  const [addedCampTypes, setAddedCampTypes] = useState(
    Array.isArray(campsiteData.campType) ? campsiteData.campType : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [campTypeQuantity, setCampTypeQuantity] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [campTypeName, setCampTypeName] = useState('');
  // const [campTypeDesc, setCampTypeDesc] = useState('');
  const [campTypePrice, setCampTypePrice] = useState('');
  const [campTypeImage, setCampTypeImage] = useState(null);
  const [campTypeWeekendRate, setCampTypeWeekendRate] = useState('');
  const modalRef = useRef(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const {campTypeImages, updateCampTypeImages} = useCampsite();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_FACILITIES_ENDPOINT}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setFacilities(response.data.data.content);
      } catch (error) {
        console.error("Error fetching facilities data:", error);
      }
    };
    fetchFacilities();
  }, []);

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

  const toggleFacility = (facilityId) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId]
    );
  };


  const handleAddCampType = () => {
    if (!campTypeName.trim() || !campTypePrice) {
      return;
    }
    if (campTypeName && campTypePrice) {
      const newCampType = {
        type: campTypeName,
        capacity: numberOfGuests,
        price: campTypePrice,
        weekendRate: campTypeWeekendRate,
        updatedAt: new Date().toISOString(),
        quantity: campTypeQuantity,
        status: true,
        facilities: selectedFacilities,
        image: campTypeImage,
      };
      setAddedCampTypes([...addedCampTypes, newCampType]);
      updateCampTypeImages(campTypeImage);
      handleClosePopUp();
    }
  };
  useEffect(() => {
    const updatedCampTypes = addedCampTypes.map(({ image, ...rest }) => rest);
    updateCampsiteData('campTypeList', updatedCampTypes);
  }, [addedCampTypes]);
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCampTypeImage(file);
    }
  };

  const handleClosePopUp = () => {
    setIsOpen(false);
    setCampTypeName('');
    setCampTypePrice('');
    setNumberOfGuests('');
    setCampTypeQuantity('');
    setCampTypeImage(null);
    setCampTypeWeekendRate('');
    setSelectedFacilities([]);
  };

  return (
    <div className='w-full bg-white py-24 px-96'>
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold'>What types of camps do you offer?</h1>
        <h2 className='text-gray-500'>Provide different glamping styles (e.g., safari tents, yurts, cabins, treehouses)</h2>
      </div>
      <div className='flex gap-4 flex-wrap'>
        {addedCampTypes.filter(camp => camp.type).map((camp, index) => (
          <div key={index} className='w-64 border rounded-xl p-4 shadow-lg'>
            {camp.image && <img src={URL.createObjectURL(camp.image)} alt='Camp' className='w-full h-auto object-cover rounded-xl' />}
            <h3 className='text-lg font-semibold mt-2'>{camp.type}</h3>
            <p className='text-gray-500'>{camp.quantity}</p>
            <p className='text-gray-500'>{camp.capacity}</p>
            <p className='text-gray-500'>{camp.weekendRate}</p>
            <p className='font-bold mt-2'>${camp.price}</p>
            <div className='mt-2 text-sm text-gray-600'>
              {Array.isArray(camp.facilities) ? camp.facilities.join(', ') : 'No facilities'}
            </div>
          </div>
        ))}
        <label 
        className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 mt-5' 
        onClick={() => setIsOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
        </label>
      </div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div className='mb-8 flex flex-col gap-4'>
              <div className='flex space-x-4'>
                <div className='w-2/4'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Name</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type name'
                    value={campTypeName}
                    onChange={(e) => setCampTypeName(e.target.value)}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Number of Guests</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter number of guests'
                    type='number'
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Image</h1>
                  <div className='flex items-center justify-center'>
                    <label className='w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100' htmlFor='imageUpload'>
                      {campTypeImage ? <img src={URL.createObjectURL(campTypeImage)} alt='Preview' className='w-full h-full object-cover rounded-xl' /> : <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />}
                    </label>
                  </div>
                  <input type='file' id='imageUpload' className='hidden' onChange={handleImageUpload} />
                </div>
              </div>
              <div className='flex space-x-4'>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Quantity</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type quantity'
                    type='number'
                    value={campTypeQuantity}
                    onChange={(e) => setCampTypeQuantity(e.target.value)}
                  />
                </div>
                <div className='w-1/2'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Price</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type price'
                    type='number'
                    value={campTypePrice}
                    onChange={(e) => setCampTypePrice(e.target.value)}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Weekend Rate</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter weekend rate'
                    type='number'
                    value={campTypeWeekendRate}
                    onChange={(e) => setCampTypeWeekendRate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h1 className='text-xl font-semibold mb-2'>Facilities</h1>
                <div className='flex gap-4 flex-wrap'>
                  {facilities?.map((facility) => (
                    <div
                      key={facility.id}
                      className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedFacilities.includes(facility.id) ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white' : 'border-gray-300'
                        }`}
                      onClick={() => toggleFacility(facility.id)}
                    >
                      {facility.name}
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className='text-right'>
              <button
                className='bg-black text-white px-4 py-2 rounded-xl'
                onClick={handleAddCampType}
              >
                Add Camp Type
              </button>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4'
                onClick={handleClosePopUp}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampType;
