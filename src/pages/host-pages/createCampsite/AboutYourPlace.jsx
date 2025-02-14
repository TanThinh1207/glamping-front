import React from 'react'

const AboutYourPlace = () => {
  return (
    <div className="w-full flex  items-center justify-center bg-white py-24 px-24 gap-10">
      <div className='w-1/2  items-start '>
        <h1 className='text-6xl font-semibold text-left leading-tight'>Tell us about <br />your Campsite</h1>
      </div>
      <div className='w-1/2  items-end'>
        <div className='p-8'>
          <h1 className='text-4xl font-semibold'>
            What is the name of your campsite?
          </h1>
          <textarea
          className='w-[80%] h-32 border-2 rounded-xl border-gray-200 p-2 m-5'
          placeholder='Create a beautiful name for your campsite'
          />
        </div>
        <div className='p-8'>
          <h1 className='text-4xl font-semibold'>
            Describe your campsite in a few words
          </h1>
          <textarea
            className='w-[80%] h-40 border-2 rounded-xl border-gray-200 p-2 m-5'
            placeholder='Describe your campsite'
          />
          </div>
      </div>
    </div>
  )
}

export default AboutYourPlace