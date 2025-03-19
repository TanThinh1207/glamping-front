import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';
import axios from 'axios';



const CampType = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [campTypeQuantity, setCampTypeQuantity] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [campTypeName, setCampTypeName] = useState('');
  const [campTypePrice, setCampTypePrice] = useState('');
  const [campTypeImage, setCampTypeImage] = useState(null);
  const [campTypeWeekendRate, setCampTypeWeekendRate] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const { campTypes, addCampType, updateCampType, removeCampType } = useCampsite();
  const [loading, setLoading] = useState(false);


  //Call api for facilities
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_FACILITIES_ENDPOINT}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setFacilities(response.data.data.content);
      } catch (error) {
        console.error("Error fetching facilities data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Close the modal when clicked outside
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

  // Facility selection
  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) => {
      const exists = prev.some((item) => item.id === facility.id);
      return exists ? prev.filter((item) => item.id !== facility.id) : [...prev, facility];
    });
  };

  // Add camp type
  const handleAddCampType = () => {
    if (!campTypeName.trim() || !campTypePrice) {
      return;
    }
    console.log(selectedFacilities);
    if (campTypeName && campTypePrice) {
      const newCampType = {
        type: campTypeName,
        capacity: numberOfGuests,
        price: campTypePrice,
        weekendRate: campTypeWeekendRate,
        quantity: campTypeQuantity,
        status: true,
        facilities: selectedFacilities,
        image: campTypeImage,
      };

      console.log(newCampType);
      addCampType(newCampType);
      handleClosePopUp();
    }
  };

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
        {campTypes.map((camp, index) => (
          <div key={index} className='w-64 border-1 rounded-xl shadow-xl relative'>
            <div className="relative">
              {camp.image && (
                <img
                  src={URL.createObjectURL(camp.image)}
                  alt="Camp"
                  className="w-full h-40 object-cover rounded-t-xl"
                />
              )}
              <button
                className="absolute -top-1 -right-1 bg-red-500 text-xs p-1 rounded-full"
                onClick={() => removeCampType(index)}
              >
                ✖
              </button>
            </div>
            <div className='p-2'>
              <h3 className='text-xl font-bold '>{camp.type} - {camp.capacity} guests</h3>
              <p className='text-gray-500'>Quantity: {camp.quantity}</p>
              <div className="text-gray-600">
                {camp.facilities.map((facility) => facility.name).join(", ")}
              </div>
              <p className='font-semibold mt-2 text-lg'>Price: {camp.price} VND</p>
              <p className='text-gray-500 text-md'>Weekend price: {camp.weekendRate} VND</p>
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
                  {facilities?.map((facility, index) => (
                    <div
                      key={facility.id}
                      className={`border-2 rounded-2xl p-2 cursor-pointer transition ${selectedFacilities.some((item) => item.id === facility.id)
                        ? 'border-gray-400 bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'border-gray-300'
                        }`}
                      onClick={() => toggleFacility({ id: facility.id, name: facility.name }, index)}
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
