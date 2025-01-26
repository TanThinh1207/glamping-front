import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
const Hosting = () => {
  const [activeTab, setActiveTab] = useState("");
  const hostInfo= {
    name: "Moc Moc",
    email: "mocmoc@gg.com",
    phone: "0123456789",
    confirmInfo: [
      {
        title: "Confirm important details",
        description: "Required to publish",
        location: "Hoang Hon Camping - Lakeview 1",
      },
      {
        title: "Confirm important details",
        description: "Required to publish",
        location: "Hoang Hon Camping - Lakeview 2",
      },
      {
        title: "Confirm important details",
        description: "Required to publish",
        location: "Hoang Hon Camping - Lakeview 3",
      },
      {
        title: "Confirm important details",
        description: "Required to publish",
        location: "Hoang Hon Camping - Lakeview 4",
      },
      {
        title: "Confirm important details",
        description: "Required to publish",
        location: "Hoang Hon Camping - Lakeview 5",
      }
    ],
    reservation: {
      checkingOut: [
        "Guest 1 - Checking Out",
        "Guest 2 - Checking Out",
        "Guest 3 - Checking Out",
        "Guest 4 - Checking Out",
        "Guest 5 - Checking Out",
      ],
      currentlyHosting: [
        "Guest 1 - Currently Hosting",
        "Guest 2 - Currently Hosting",
        "Guest 3 - Currently Hosting",
        "Guest 4 - Currently Hosting",
        "Guest 5 - Currently Hosting",
      ],
      arrivingSoon: [
        "Guest 1 - Arriving Soon",
        "Guest 2 - Arriving Soon",
        "Guest 3 - Arriving Soon",
        "Guest 4 - Arriving Soon",
        "Guest 5 - Arriving Soon",
      ],
      upcoming: [
        "Guest 1 - Upcoming",
        "Guest 2 - Upcoming",
        "Guest 3 - Upcoming",
        "Guest 4 - Upcoming",
        "Guest 5 - Upcoming",
      ],
      pendingReview: [
        "Review 1 - Pending",
        "Review 2 - Pending",
        "Review 3 - Pending",
        "Review 4 - Pending",
        "Review 5 - Pending",
      ],
    }


  }
  return (
    <div className="w-full h-screen bg-white">
      <div className="mx-auto px-30 max-w-7xl text-left">
        <div>
          <h1 className="text-4xl font-bold py-8">Welcome back, {hostInfo.name}</h1>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center justify-center">
          <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl">
            <div className="px-5 py-2">
              <h6 className="mb-2 text-red-600 text-xl font-semibold">
                Confirm important details
              </h6>
              <h6 className="text-red-600 text-l font-light">
                Required to publish
              </h6>
              <p className="text-slate-600 leading-normal font-light">
                Hoang Hon Camping - Lakeview 1
              </p>
            </div>
            <div className="px-5 pb-4">
              <button
                className="text-black-500 underline hover:text-black-900 focus:outline-none disabled:text-black-700"
                type="button"
              >
                Start
              </button>

            </div>
          </div>
          {/* <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl">
            <div className="px-5 py-2">
              <h6 className="mb-2 text-red-600 text-xl font-semibold">
                Confirm important details
              </h6>
              <h6 className="text-red-600 text-l font-light">
                Required to publish
              </h6>
              <p className="text-slate-600 leading-normal font-light">
                Hoang Hon Camping - Lakeview 1
              </p>
            </div>
            <div className="px-5 pb-4">
              <button
                className="text-black-500 underline hover:text-black-900 focus:outline-none disabled:text-black-700"
                type="button"
              >
                Start
              </button>
            </div>
          </div> 
        </div> */}
         <Swiper
       modules={[Navigation]}
       spaceBetween={30}
       slidesPerView={4}
       navigation
       onSlideChange={() => console.log("slide change")}
       onSwiper={(swiper) => console.log(swiper)}
    >
      {hostInfo.confirmInfo.map((info) => (
      <SwiperSlide>
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl">
          <div className="px-5 py-2">
            <h6 className="mb-2 text-red-600 text-xl font-semibold">
              {info.title}
            </h6>
            <h6 className="text-red-600 text-l font-light">
              {info.description}
            </h6>
            <p className="text-slate-600 leading-normal font-light">
              {info.location}
            </p>
            <div className="px-5 pb-4">
              <button
                className="text-black-500 underline hover:text-black-900 focus:outline-none disabled:text-black-700"
                type="button"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </SwiperSlide>
      ))}
    </Swiper>
      </div>
      <div className="mx-auto px-30 max-w-7xl text-left">
        <div className="">
          <h1 className="text-4xl font-bold py-8">Your reservations</h1>
        </div>
        <div className="flex flex-row gap-6 items-start justify-start">
          <ul className="flex flex-row gap-6">
            {[
              { label: "Checking out (0)", value: "checkingOut" },
              { label: "Currently hosting (0)", value: "currentlyHosting" },
              { label: "Arriving soon (0)", value: "arrivingSoon" },
              { label: "Upcoming (0)", value: "upcoming" },
              { label: "Pending review (0)", value: "pendingReview" },
            ].map((tab) => (
              <li key={tab.value}>
                <button
                  className={`rounded-full border border-black py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg ${activeTab === tab.value
                      ? "text-white bg-slate-800 border-slate-800"
                      : "text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
                    }`}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='bg-slate-100 rounded-lg w-auto h-60 my-4 text-center flex items-center justify-center align-middle'>
          {activeTab === "checkingOut" && (
            <p className=''>
              You don’t have any guests checking out today.
            </p>
          )}
          {activeTab === "currentlyHosting" && (
            <p>
              You don’t have any guests staying with you right now.
            </p>
          )}
          {activeTab === "arrivingSoon" && (
            <p>
              You don’t have any guests arriving today or tomorrow.
            </p>
          )}
          {activeTab === "upcoming" && (
            <p>
              You currently don’t have any upcoming guests.
            </p>
          )}
          {activeTab === "pendingReview" && (
            <p>
              You don't have any guest reviews to write.
            </p>
          )}
        </div>
      </div>
    </div>

  );
};

export default Hosting