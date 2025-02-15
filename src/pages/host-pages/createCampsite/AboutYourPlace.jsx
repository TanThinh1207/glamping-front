import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const AboutYourPlace = () => {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'; // Prevent scrolling on <html>
    document.body.style.overflow = 'hidden'; // Prevent scrolling on <body>
    
    return () => {
      document.documentElement.style.overflow = 'auto'; // Reset when unmounting
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <div className="w-full flex  items-center justify-center bg-white py-24 px-24 gap-10">
      <div className='w-1/3 flex items-start'>
        <h1 className='text-6xl font-semibold text-left leading-tight'>
          Tell us about <br />your Campsite
        </h1>
      </div>
      <div className='w-2/3 h-[80vh] overflow-y-auto p-8'>
        <div className='mb-8 '>
          <h1 className='text-4xl font-semibold'>
            What is the name of your campsite?
          </h1>
          <textarea
            className='w-[80%] h-32 border-2 rounded-xl border-gray-200 p-2 mt-5'
            placeholder='Create a beautiful name for your campsite'
          />
        </div>
        <div className='mb-8'>
          <h1 className='text-4xl font-semibold'>
            Describe your campsite in a few words
          </h1>
          <textarea
            className='w-[80%] h-32 border-2 rounded-xl border-gray-200 p-2 mt-5'
            placeholder='Describe your campsite'
          />
        </div>
        <div className='mb-8'>
          <h1 className='text-4xl font-semibold'>
            Add some photos of your campsite
          </h1>
          <input
            type='file'
            id='file-upload'
            className='hidden'
          />
          <label
            htmlFor='file-upload'
            className='w-32 h-32 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 p-2 mt-5'
          >
            <FontAwesomeIcon icon={faPlus} className='text-gray-400 text-3xl' />
          </label>
        </div>
      </div>
    </div>
  )
}

export default AboutYourPlace