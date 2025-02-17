import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';

const Services = () => {
  const [addedServices, setAddedServices] = useState([]);
  const [isOpen, onClose] = useState(false);
  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  return (
    <div className='w-full  bg-white py-24 px-96'>
      <div className='mb-8'>
        <h1 className='text-4xl font-semibold'>
          Which are the services you offer?
        </h1>
        <h2 className='text-gray-500'>
          Add services that you offer to your guests
        </h2>
      </div>
      <div className=''>
        <label
          className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 mt-5'
          onClick={() => onClose(true)}
        >
          <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
        </label>
      </div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 '>
          <div
            ref={modalRef}
            className="bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl"
          >
            <div className='mb-8 flex gap-4 '>
              <div className='w-2/3'>
                <h1 className='text-xl font-semibold'>
                  Service name
                </h1>
                <input
                  className='w-full h-10 border-2 rounded-xl border-gray-200 p-2 mt-5'
                  placeholder='Enter your service name'
                />
              </div>
              <div className='w-1/2 flex gap-4'>
                <h1 className='text-xl font-semibold'>
                  Service image
                </h1>
                <label
                  className='w-20 h-20 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 '
                  onClick={() => onClose(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
                </label>
              </div>
            </div>
            <div className='mb-8'>
              <h1 className='text-xl font-semibold'>
                Service description
              </h1>
              <textarea
                className='w-full h-32 border-2 rounded-xl border-gray-200 p-2 mt-5'
                placeholder='Enter your service description'
              />
            </div>
            <div className='mb-8'>
              <h1 className='text-xl font-semibold'>
                Service price
              </h1>
              <input
                className='w-full h-10 border-2 rounded-xl border-gray-200 p-2 mt-5'
                placeholder='Enter your service price'
                type='number'
              />
            </div>
            <div className='mb-8 text-right'>
              <button className='bg-black text-white px-4 py-2 rounded-xl'>
                Add service
              </button>
              <button
                className='bg-red-500 text-white px-4 py-2 rounded-xl ml-4'
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Services