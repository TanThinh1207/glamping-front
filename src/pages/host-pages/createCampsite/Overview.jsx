import React from 'react'
import overviewImage1 from '../../../assets/overviewImage1.png';
import overviewImage2 from '../../../assets/overviewImage2.png';
import overviewImage3 from '../../../assets/overviewImage3.png';

const Overview = () => {
    return (
        <div className="w-full flex  items-center justify-center bg-white py-24 px-24 gap-10">
            <div className='w-1/2  items-start '>
                <h1 className='text-6xl font-semibold text-left leading-tight'>It’s easy to get <br />started on Glampé</h1>
            </div>
            <div className='w-1/2  items-end'>
                <div className="flex items-start space-x-4 border-b-2 border-gray-200 pb-[32px]">
                    <div className='w-[3%]'>
                        <h2 className="font-semibold text-2xl">1</h2>
                    </div>
                    <div className='w-[77%]'>
                        <h2 className="font-semibold text-2xl">Tell us about yout campsite</h2>
                        <p className="text-gray-600 text-lg">Share basic details, like the location, type of accommodation, and amenities.</p>
                    </div>
                    <div className="w-[20%] flex justify-end">
                        <img src={overviewImage1} alt="overviewImage1" className="w-[120px] h-[120px] object-cover" />
                    </div>
                </div>
                <div className="flex items-start space-x-4 border-b-2 border-gray-200 py-[32px]">
                    <div className='w-[3%]'>
                        <h2 className="font-semibold text-2xl">2</h2>
                    </div>
                    <div className='w-[77%]'>
                        <h2 className="font-semibold text-2xl">Make your listing stand out</h2>
                        <p className="text-gray-600 text-lg">Upload high-quality photos, add a catchy title, and describe the unique experience.</p>
                    </div>
                    <div className="w-[20%] flex justify-end">
                        <img src={overviewImage2} alt="overviewImage2" className="w-[120px] h-[120px] object-cover" />
                    </div>
                </div>
                <div className="flex items-start space-x-4 py-[32px]">
                    <div className='w-[3%]'>
                        <h2 className="font-semibold text-2xl">3</h2>
                    </div>
                    <div className='w-[77%]'>
                        <h2 className="font-semibold text-2xl">Set your price & publish</h2>
                        <p className="text-gray-600 text-lg">Choose your nightly rate, complete verification, and publish your listing to start hosting.</p>
                    </div>
                    <div className="w-[20%] flex justify-end">
                        <img src={overviewImage3} alt="overviewImage3" className="w-[120px] h-[120px] object-cover" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview