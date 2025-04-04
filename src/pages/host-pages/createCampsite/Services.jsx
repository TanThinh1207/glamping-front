import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCampsite } from '../../../context/CampsiteContext';

const Services = () => {
  const { campsiteData, updateCampsiteData } = useCampsite();
  const { services, addService, updateService, removeService } = useCampsite();

  const [isOpen, setIsOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceImage, setServiceImage] = useState(null);


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


  // Add service
  const handleAddService = () => {
    if (!serviceName.trim() || !serviceDesc.trim() || !servicePrice) {
      return;
    }
    if (serviceName && serviceDesc && servicePrice) {
      const newService = {
        name: serviceName,
        description: serviceDesc,
        price: servicePrice,
        image: serviceImage,
      };
      console.log(newService);
      addService(newService);
      handleClosePopUp();
    }
  };


  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setServiceImage(file);
      console.log(file);
    }
  };

  // Close the modal
  const handleClosePopUp = () => {
    setIsOpen(false);
    setServiceName('');
    setServiceDesc('');
    setServicePrice('');
    setServiceImage(null);
  }

  // Format VND
  const formatVND = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice)
      ? numPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "Invalid price";
  };
  const isFormValid = serviceName.trim() && serviceDesc.trim() && servicePrice && serviceImage;

  return (
    <div className='w-full bg-white py-24 px-96'>
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold'>
          Which are the services you offer?
        </h1>
        <h2 className='text-gray-500'>
          Add services that you offer to your guests
        </h2>
      </div>
      <div className='flex gap-4 flex-wrap'>
        {services.filter(service => service.name).map((service, index) => (
          <div key={index} className='w-64 h-min border-1 rounded-xl  shadow-xl relative'>
            <div className='relative'>
              {service.image && (
                <img
                  src={URL.createObjectURL(service.image)}
                  alt='Service'
                  className='w-full h-40 object-cover rounded-t-xl'
                />
              )}
              <button
                className="absolute -top-1 -right-1 bg-red-500 text-xs p-1 rounded-full"
                onClick={() => removeService(index)}
              >
                ✖
              </button>
            </div>
            <div className='p-2'>
              <h3 className='text-xl font-bold '>{service.name}</h3>
              <p className='text-gray-500'>{service.description}</p>
              <p className='font-semibold mt-2 text-lg'>Price: {formatVND(service.price)}</p>
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
                <div className='w-3/4'>
                  <h1 className='text-xl font-semibold mb-2'>Service Name</h1>
                  <input
                    className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                    placeholder='Enter your service name'
                    value={services.name}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>
                <div className='1/4'>
                  <h1 className='text-xl font-semibold mb-2'>Service Image</h1>
                  <div className='flex items-center justify-center'>
                    <label
                      className='w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center  cursor-pointer hover:bg-gray-100 '
                      htmlFor='imageUpload'>
                      {serviceImage ? <img
                        src={URL.createObjectURL(serviceImage)}
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
                  value={services.description}
                  onChange={(e) => setServiceDesc(e.target.value)}
                />
              </div>
              <div>
                <h1 className='text-xl font-semibold mb-2'>Service Price</h1>
                <input
                  className='w-full h-10 border-2 rounded-xl border-gray-200 p-2'
                  placeholder='Enter your service price'
                  type='number'
                  value={services.price}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
              </div>
            </div>
            <div className='text-right'>
              <button
                className={`px-4 py-2 rounded-xl ${isFormValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                onClick={handleAddService}
                disabled={!isFormValid}
              >
                Add service
              </button>
              <button className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4' onClick={handleClosePopUp}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
