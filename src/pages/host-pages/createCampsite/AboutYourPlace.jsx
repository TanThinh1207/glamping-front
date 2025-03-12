import React, { useState } from 'react'
import { useCampsite } from '../../../context/CampsiteContext'

const AboutYourPlace = () => {
  const {campsiteData, updateCampsiteData} = useCampsite();
  return (
    <div className="w-full flex  items-center justify-center bg-white py-24 px-24 gap-10">
      <div className='w-1/2 flex items-start'>
        <h1 className='text-6xl font-semibold text-left leading-tight'>
          Tell us about <br />your Campsite
        </h1>
      </div>
      <div className='w-1/2  p-8'>
        <div className='mb-8 '>
          <h1 className='text-4xl font-semibold'>
            What is the name of your campsite?
          </h1>
          <textarea
            className='w-[80%] h-32 border-2 rounded-xl border-gray-200 p-2 mt-5'
            placeholder='Create a beautiful name for your campsite'
            value={campsiteData.name}
            onChange={(e) => updateCampsiteData('name', e.target.value)}
          />
        </div>
        <div className='mb-8'>
          <h1 className='text-4xl font-semibold'>
            Describe your campsite in a few words
          </h1>
          <textarea
            className='w-[80%] h-32 border-2 rounded-xl border-gray-200 p-2 mt-5'
            placeholder='Describe your campsite'
            value={campsiteData.description}
            onChange={(e) => updateCampsiteData('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutYourPlace