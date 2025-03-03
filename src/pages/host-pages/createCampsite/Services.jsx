import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';
import { Hand } from 'lucide-react';

const Services = () => {
  const { campsiteData, updateCampsiteData } = useCampsite();
  const [addedServices, setAddedServices] = useState(
    Array.isArray(campsiteData.campsiteServices) ? campsiteData.campsiteServices : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceImage, setServiceImage] = useState(null);
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

  const handleAddService = () => {
    if(!serviceName.trim() || !serviceDesc.trim() || !servicePrice) {
      return;
    }
    if (serviceName && serviceDesc && servicePrice) {
      const newService = {
        name: serviceName,
        description: serviceDesc,
        price: servicePrice,
        image: serviceImage,
      };
      setAddedServices((prevServices) => [...prevServices, newService]);
      handleClosePopUp();
    }
  };
  
  useEffect(() => {
    updateCampsiteData("campsiteServices", addedServices);
  }, [addedServices]);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setServiceImage(URL.createObjectURL(file));
    }
  };
  const handleClosePopUp = () => {
    setIsOpen(false);
    setServiceName('');
    setServiceDesc('');
    setServicePrice('');
    setServiceImage(null);
  }
  return (
    <div className='w-full bg-white py-24 px-96'>
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold'>Which are the services you offer?</h1>
        <h2 className='text-gray-500'>Add services that you offer to your guests</h2>
      </div>
      <div className='flex gap-4 flex-wrap'>
        {addedServices.filter(service => service.name).map((service, index) => (
          <div key={index} className='w-64 border rounded-xl p-4 shadow-lg'>
            {service.image && <img src={service.image} alt='Service' className='w-full h-auto object-cover rounded-xl' />}
            <h3 className='text-lg font-semibold mt-2'>{service.name}</h3>
            <p className='text-gray-500'>{service.description}</p>
            <p className='font-bold mt-2'>${service.price}</p>
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
              <h1 className='text-xl font-semibold'>Service Name</h1>
              <input className='w-full h-10 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter your service name' value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              <h1 className='text-xl font-semibold'>Service Image</h1>
              <label className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 ' htmlFor='imageUpload'>
                {serviceImage ? <img src={serviceImage} alt='Preview' className='w-full h-full object-cover rounded-xl' /> : <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />}
              </label>
              <input type='file' id='imageUpload' className='hidden' onChange={handleImageUpload} />
              <h1 className='text-xl font-semibold'>Service Description</h1>
              <textarea className='w-full h-32 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter your service description' value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} />
              <h1 className='text-xl font-semibold'>Service Price</h1>
              <input className='w-full h-10 border-2 rounded-xl border-gray-200 p-2' placeholder='Enter your service price' type='number' value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
            </div>
            <div className='text-right'>
              <button className='bg-black text-white px-4 py-2 rounded-xl' onClick={handleAddService}>Add service</button>
              <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleClosePopUp}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
