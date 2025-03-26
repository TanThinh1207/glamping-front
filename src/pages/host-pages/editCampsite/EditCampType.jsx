import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCampsite } from '../../../context/CampsiteContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const EditCampType = () => {
  const { campsite, fetchCampsiteDetails } = useCampsite()
  const { id } = useParams();
  const [newCampType, setNewCampType] = useState({
    campSiteId: id,
    type: "",
    capacity: "",
    price: "",
    quantity: "",
    weekendRate: "",
    facilities: [],
  });
  const [newImage, setNewImage] = useState("");
  const [addNewCampType, setAddNewCampType] = useState(false);
  const [campTypes, setCampTypes] = useState([]);
  const [updateCampType, setUpdateCampType] = useState(null);
  const modalRef = useRef(null);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  //Call api for facilities
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
    console.log("Updated camptype ", campsite.campSiteCampTypeList);
      if(campsite.campSiteCampTypeList) {
        setCampTypes(campsite.campSiteCampTypeList);
      }
    console.log(id);
  }, [campsite]);

  useEffect(() => {
    console.log("Updated camptypes:", campTypes);
  }, [campTypes]);
  // Format VND
  const formatVND = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice)
      ? numPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "Invalid price";
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleCloseAddCampType = () => {
    setAddNewCampType(false);
    setNewCampType({
      campSiteId: id,
      type: "",
      capacity: "",
      price: "",
      quantity: "",
      weekendRate: "",
      facilities: [],
    });
    setNewImage(null);
  }

  const handleAddCampType = async () => {
    try {
      console.log('Adding new camp type:', JSON.stringify(newCampType));
      console.log('Selected facilities:', selectedFacilities);
      const newCamptypeData = {
        ...newCampType,
        facilities: selectedFacilities.map((facility) => facility.id),
      }
      console.log('New camp type data:', newCamptypeData);
      const response = await axios.post(`${import.meta.env.VITE_API_GET_CAMPTYPES}`, JSON.stringify(newCamptypeData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newCampTypeId = response.data.data.id;
      const formData = new FormData();
      formData.append('id', newCampTypeId);
      formData.append('file', newImage);
      formData.append('type', 'campType');
      await axios.post(`${import.meta.env.VITE_API_IMAGE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCampsiteDetails();
      handleCloseAddCampType();
    } catch (error) {
      console.error('Error adding new service:', error);
    }
  };

  const handleEditCampType = (campType) => {
    setUpdateCampType(campType);
    setSelectedFacilities(campType.facilities || []);
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) => {
      const isSelected = prev.some((item) => item.id === facility.id);
      return isSelected
        ? prev.filter((item) => item.id !== facility.id)
        : [...prev, facility];
    });
  };

  const handleCloseUpdateCampType = () => {
    setUpdateCampType(null);
    setSelectedFacilities([]);
  }

  const handleUpdateCampType = async () => {
    try {
      console.log('Updating camp type:', updateCampType);
      console.log('Selected facilities:', selectedFacilities);
      const { type, capacity, price, quantity, weekendRate } = updateCampType;
      const filteredFacilities = selectedFacilities.map((facility) => facility.id);
      const filteredCampType = { type, capacity, price, quantity, weekendRate};
      await axios.put(`${import.meta.env.VITE_API_GET_CAMPTYPES}/${updateCampType.id}` , JSON.stringify(filteredCampType), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await axios.put(`${import.meta.env.VITE_API_GET_CAMPTYPES}/${updateCampType.id}/facilities/`, JSON.stringify(filteredFacilities), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchCampsiteDetails();
      handleCloseUpdateCampType();
    } catch (error) {
      console.error('Error updating camp type:', error);
    }
  }
  return (
    <div className='min-h-screen px-44 pb-20 relative'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-semibold'>Campsite's camp types</h1>
          <h2 className='text-lg text-gray-400'>Manage camp types.</h2>
        </div>
        <label
          className='w-10 h-10 flex items-center justify-center text-xl text-black bg-gray-100 rounded-full cursor-pointer'
          onClick={() => setAddNewCampType(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </label>
      </div>
      <div className='flex gap-4 flex-wrap mt-10'>
        {campTypes.map((campType) => (
          <div
            key={campType.id}
            className='w-64 h-min border-1 rounded-xl shadow-xl cursor-pointer relative group'
            onClick={() => handleEditCampType(campType)}
          >
            <div className='relative'>
              <div className="absolute bg-black bg-opacity-50 text-white text-center text-xl font-bold rounded-xl p-2">
                {campType.type} - {campType.capacity} guests
              </div>
              {campType.image && (
                <img
                  src={campType.image}
                  alt='Service'
                  className='w-full h-40 object-cover rounded-t-xl'
                />
              )}
            </div>
            <div className='p-2'>
              <p className='text-gray-500'>Quantity: {campType.quantity}</p>
              <div className="text-gray-600">
                {campType.facilities.map((facility) => facility.name).join(", ")}
              </div>
              <p className='font-semibold mt-2 text-lg'>Price: {formatVND(campType.price)}</p>
              <p className='text-gray-500 text-md'>Weekend price: {formatVND(campType.weekendRate)}</p>
            </div>
          </div>
        ))}
      </div>
      {addNewCampType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div className='mb-8 flex flex-col gap-4'>
              <div className='flex space-x-4'>
                <div className='w-2/4'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Name</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type name'
                    value={newCampType.type}
                    onChange={(e) => setNewCampType({ ...newCampType, type: e.target.value })}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Number of Guests</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter number of guests'
                    type='number'
                    value={newCampType.capacity}
                    onChange={(e) => setNewCampType({ ...newCampType, capacity: e.target.value })}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Image</h1>
                  <div className='flex items-center justify-center'>
                    <label className='w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100' htmlFor='imageUpload'>
                      {newImage ? <img src={URL.createObjectURL(newImage)} alt='Preview' className='w-full h-full object-cover rounded-xl' /> : <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />}
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
                    value={newCampType.quantity}
                    onChange={(e) => setNewCampType({ ...newCampType, quantity: e.target.value })}
                  />
                </div>
                <div className='w-1/2'>
                  <h1 className='text-xl font-semibold mb-2'>Camp Type Price</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type price'
                    type='number'
                    value={newCampType.price}
                    onChange={(e) => setNewCampType({ ...newCampType, price: e.target.value })}
                  />
                </div>
                <div className='w-1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Weekend Rate</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter weekend rate'
                    type='number'
                    value={newCampType.weekendRate}
                    onChange={(e) => setNewCampType({ ...newCampType, weekendRate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <h1 className='text-xl font-semibold mb-2'>Facilities</h1>
                <div className='flex gap-4 flex-wrap'>
                  {facilities?.map((facility, index) => (
                    <div
                      key={facility.id}
                      className={` rounded-2xl p-2 cursor-pointer transition ${selectedFacilities.some((item) => item.id === facility.id)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 border'
                        : 'border-gray-300 border'
                        }`}
                      onClick={() => toggleFacility(facility)}
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
                onClick={handleCloseAddCampType}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {updateCampType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg w-3/5 h-4/5 relative rounded-xl'>
            <div className='flex w-full h-full'>
              <div className='relative w-1/2 h-full'>
                <img src={updateCampType.image} alt='campsite' className='w-auto h-full object-cover rounded-l-xl ' />
              </div>
              <div className='w-1/2 p-6 flex flex-col overflow-y-auto'>
                <div className='flex space-x-4 mb-4'>
                  <div className='w-1/2'>
                    <h1 className='text-2xl font-semibold mb-2'>Camp type Name</h1>
                    <input
                      className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                      placeholder='Enter your camp type name'
                      value={updateCampType.type}
                      onChange={(e) => setUpdateCampType({ ...updateCampType, type: e.target.value })}
                    />
                  </div>
                  <div className='w-1/2'>
                    <h1 className='text-2xl font-semibold mb-2'>Number of Guests</h1>
                    <input
                      className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                      placeholder='Enter number of guests'
                      type='number'
                      value={updateCampType.capacity}
                      onChange={(e) => setUpdateCampType({ ...updateCampType, capacity: e.target.value })}
                    />
                  </div>
                </div>

                <div className='mb-4'>
                  <h1 className='text-2xl font-semibold mb-2'>Quantity</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter camp type quantity'
                    type='number'
                    value={updateCampType.quantity}
                    onChange={(e) => setUpdateCampType({ ...updateCampType, quantity: e.target.value })}
                  />
                </div>
                <div className='mb-4 flex space-x-4'>
                  <div className='w-1/2'>
                    <h1 className='text-2xl font-semibold mb-2'>Price</h1>
                    <input
                      className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                      placeholder='Enter your service price'
                      type='number'
                      value={updateCampType.price}
                      onChange={(e) => setUpdateCampType({ ...updateCampType, price: e.target.value })}
                    />
                  </div>
                  <div className='w-1/2'>
                    <h1 className='text-2xl font-semibold mb-2'>Weekend Rate</h1>
                    <input
                      className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                      placeholder='Enter your service price'
                      type='number'
                      value={updateCampType.weekendRate}
                      onChange={(e) => setUpdateCampType({ ...updateCampType, weekendRate: e.target.value })}
                    />
                  </div>
                </div>
                <div className='mb-4'>
                  <h1 className='text-2xl font-semibold mb-2'>Facilities</h1>
                  <div className='flex gap-4 flex-wrap'>
                      {facilities?.map((facility) => (
                        <div
                          key={facility.id}
                          className={`rounded-2xl p-2 cursor-pointer transition ${selectedFacilities.some((item) => item.id === facility.id)
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 border"
                              : "border-gray-300 border"
                            }`}
                          onClick={() => toggleFacility(facility)}
                        >
                          {facility.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='text-right p-4'>
                    <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={handleUpdateCampType} >Update</button>
                    <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleCloseUpdateCampType}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
        </div>
      )
      }

      export default EditCampType