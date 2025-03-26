import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCampsite } from '../../../context/CampsiteContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const EditService = () => {
  const { campsite, fetchCampsiteDetails } = useCampsite()
  const { id } = useParams();
  const [newService, setNewService] = useState({
    campSiteId: id,
    name: "",
    description: "",
    price: "",
  });
  const [newImage, setNewImage] = useState("");
  const [addNewService, setAddNewService] = useState(false);
  const [services, setServices] = useState([]);
  const [updateService, setUpdateService] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    console.log("Updated campsite.campSiteSelectionsList:", campsite.campSiteSelectionsList);
    if (campsite.campSiteSelectionsList) {
      setServices(campsite.campSiteSelectionsList);
    }
    console.log(id);
  }, [campsite]);

  useEffect(() => {
    console.log("Updated services:", services);
  }, [services]);
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

  const handleCloseAddService = () => {
    setAddNewService(false);
    setNewService({
      campSiteId: id,
      name: "",
      description: "",
      price: "",
    });
    setNewImage(null);
  }

  const handleAddNewService = async () => {
    try {
      console.log('Adding new service:', JSON.stringify(newService));
      const response = await axios.post(`${import.meta.env.VITE_API_SELECTIONS}`, JSON.stringify(newService), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('New service added:', response.data.data);
      const newServiceId = response.data.data.id;
      const formData = new FormData();
      formData.append('id', newServiceId);
      formData.append('file', newImage);
      formData.append('type', 'selection');
      await axios.post(`${import.meta.env.VITE_API_IMAGE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCampsiteDetails();
      handleCloseAddService();
    } catch (error) {
      console.error('Error adding new service:', error);
    }
  };

  const handleCloseUpdateService = () => {
    setUpdateService(null);
  };

  const handleUpdateService = async () => {
    try {
        const { id, name, description, price } = updateService;
        const numericPrice = Number(price);
        const filteredService = { id, name, description, price: numericPrice };

        console.log('Updating service:', JSON.stringify(filteredService));
        await axios.put(`${import.meta.env.VITE_API_SELECTIONS}`, JSON.stringify(filteredService), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetchCampsiteDetails();
        handleCloseUpdateService();
    } catch (error) {
        console.error('Error updating service:', error);
    }
};
  return (
    <div className='h-screen px-44 pb-20 relative'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-semibold'>Campsite's services</h1>
          <h2 className='text-lg text-gray-400'>Manage services.</h2>
        </div>
        <label
          className='w-10 h-10 flex items-center justify-center text-xl text-black bg-gray-100 rounded-full cursor-pointer'
          onClick={() => setAddNewService(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </label>
      </div>
      <div className='flex gap-4 flex-wrap mt-10'>
        {services.map((service) => (
          <div
            key={service.id}
            className='w-64 h-min border-1 rounded-xl shadow-xl cursor-pointer relative group'
            onClick={() => setUpdateService(service)}
          >
            <div className='relative'>
              <div className="absolute bg-black bg-opacity-50 text-white text-center text-xl font-bold rounded-xl p-2">
                {service.name}
              </div>
              {service.image && (
                <img
                  src={service.image}
                  alt='Service'
                  className='w-full h-40 object-cover rounded-t-xl'
                />
              )}
            </div>
            <div className='p-2'>
              <p className='text-gray-500'>{service.description}</p>
              <p className='font-semibold mt-2 text-lg'>Price: {formatVND(service.price)}</p>
            </div>
          </div>
        ))}
      </div>
      {addNewService && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div className='mb-8 flex flex-col gap-4'>
              <div className='flex space-x-4'>
                <div className='w-3/4'>
                  <h1 className='text-xl font-semibold mb-2'>Service Name</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter your service name'
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div className='1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Service Image</h1>
                  <div className='flex items-center justify-center'>
                    <label
                      className='w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center  cursor-pointer hover:bg-gray-100 '
                      htmlFor='imageUpload'>
                      {newImage ? <img
                        src={URL.createObjectURL(newImage)}
                        alt='Preview' className='w-full h-full object-cover rounded-xl'
                      />
                        : <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />}
                    </label>
                  </div>
                  <input type='file' id='imageUpload' className='hidden' onChange={handleImageUpload} />
                </div>
              </div>
              <div>
                <h1 className='text-xl font-semibold mb-2'>Service Description</h1>
                <textarea
                  className='w-full h-32 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service description'
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
              <div>
                <h1 className='text-xl font-semibold mb-2'>Service Price</h1>
                <input
                  className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service price'
                  type='number'
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
            </div>
            <div className='text-right'>
              <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={handleAddNewService} >Add service</button>
              <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleCloseAddService}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {updateService && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg w-3/5 h-4/5 relative rounded-xl'>
          <div className='flex w-full h-full'>
            <div className='relative w-1/2 h-full'>
              <img src={updateService.image} alt='campsite' className='w-auto h-full object-cover rounded-l-xl ' />
            </div>
            <div className='w-1/2 p-6 flex flex-col overflow-y-auto'>
              <div className='mb-4'>
                <h1 className='text-2xl font-semibold mb-2'>Service Name</h1>
                <input
                  className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service name'
                  value={updateService.name}
                  onChange={(e) => setUpdateService({ ...updateService, name: e.target.value })}
                />
              </div>
              <div className='mb-4'>
                <h1 className='text-2xl font-semibold mb-2'>Service Description</h1>
                <textarea
                  className='w-full h-32 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service description'
                  value={updateService.description}
                  onChange={(e) => setUpdateService({ ...updateService, description: e.target.value })}
                />
              </div>
              <div className='mb-4'>
                <h1 className='text-2xl font-semibold mb-2'>Service Price</h1>
                <input
                  className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service price'
                  type='number'
                  value={updateService.price}
                  onChange={(e) => setUpdateService({ ...updateService, price: e.target.value })}
                />
              </div>
              <div className='text-right p-4'>
                <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={handleUpdateService} >Update service</button>
                <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleCloseUpdateService}>Cancel</button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditService