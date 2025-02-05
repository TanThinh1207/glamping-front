  import React, { useState } from 'react'
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Navigation } from 'swiper/modules';
  import 'swiper/swiper-bundle.css';
  const Hosting = () => {
    const [activeTab, setActiveTab] = useState("");
    const hostInfo = {
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
          {
            name: "Guest 1",
            location: "Hoang Hon Camping - Lakeview 1",
            checkOutTime: "12:00 PM",
            checkOutDate: "June 30, 2021",
          },
          {
            name: "Guest 2",
            location: "Hoang Hon Camping - Lakeview 2",
            checkOutTime: "12:00 PM",
            checkOutDate: "June 30, 2021",
          },
          {
            name: "Guest 3",
            location: "Hoang Hon Camping - Lakeview 3",
            checkOutTime: "12:00 PM",
            checkOutDate: "June 30, 2021",
          },
          {
            name: "Guest 4",
            location: "Hoang Hon Camping - Lakeview 4",
            checkOutTime: "12:00 PM",
            checkOutDate: "June 30, 2021",
          },
          {
            name: "Guest 5",
            location: "Hoang Hon Camping - Lakeview 5",
            checkOutTime: "12:00 PM",
            checkOutDate: "June 30, 2021",
          },
        ],
        currentlyHosting: [
          {
            name: "Guest 1",
            location: "Hoang Hon Camping - Lakeview 1",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 2",
            location: "Hoang Hon Camping - Lakeview 2",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 3",
            location: "Hoang Hon Camping - Lakeview 3",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 4",
            location: "Hoang Hon Camping - Lakeview 4",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 5",
            location: "Hoang Hon Camping - Lakeview 5",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          }
        ],
        arrivingSoon: [
          {
            name: "Guest 1",
            location: "Hoang Hon Camping - Lakeview 1",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 2",
            location: "Hoang Hon Camping - Lakeview 2",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 3",
            location: "Hoang Hon Camping - Lakeview 3",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 4",
            location: "Hoang Hon Camping - Lakeview 4",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 5",
            location: "Hoang Hon Camping - Lakeview 5",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          }
        ],
        upcoming: [
          {
            name: "Guest 1",
            location: "Hoang Hon Camping - Lakeview 1",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 2",
            location: "Hoang Hon Camping - Lakeview 2",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 3",
            location: "Hoang Hon Camping - Lakeview 3",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          },
          {
            name: "Guest 4",
            location: "Hoang Hon Camping - Lakeview 4",
            checkInTime: "3:00 PM",
            checkInDate: "June 30, 2021",
          }
        ],
        pendingReview: [
        ],
      }


    }
    return (
      <div className="w-full h-screen bg-white">
        <div className="mx-auto px-30 max-w-7xl text-left">
          <div>
            <h1 className="text-4xl font-bold py-8">Welcome back, {hostInfo.name}</h1>
          </div>
          <div className="mx-4">
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
            >
              {hostInfo.confirmInfo.map((info) => (
                <SwiperSlide key={info.location}>
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
        </div>
        <div className="mx-auto px-30 max-w-7xl text-left">
          <div className="">
            <h1 className="text-4xl font-bold py-8">Your reservations</h1>
          </div>
          <div className="flex flex-row gap-6 items-start justify-start">
            <ul className="flex flex-row gap-6">
              {Object.keys(hostInfo.reservation).map((key) => (
                <li key={key}>
                  <button
                    className={`rounded-full border border-black py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg ${activeTab === key
                      ? "text-white bg-slate-800 border-slate-800"
                      : "text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
                      }`}
                    type="button"
                    onClick={() => setActiveTab(key)}
                  >
                    {key} ({hostInfo.reservation[key].length})
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-4'>
            {activeTab && hostInfo.reservation[activeTab].length === 0 && (
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
            )}
            <div className="mx-4">
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
            >
              {hostInfo.reservation[activeTab]?.map((info) => (
                <SwiperSlide>
                  <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl">
                    <div className="px-5 py-2">
                      <h6 className="mb-2 text-red-600 text-xl font-semibold">
                        {info.name}
                      </h6>
                      <h6 className="text-red-600 text-l font-light">
                        {info.location}
                      </h6>
                      <p className="text-slate-600 leading-normal font-light">
                        {activeTab === "checkingOut" ? `Check out by ${info.checkOutTime} on ${info.checkOutDate}` : `Check in at ${info.checkInTime} on ${info.checkInDate}`}
                      </p>
                      <div className="px-5 pb-4">
                        <button
                          className="text-black-500 underline hover:text-black-900 focus:outline-none disabled:text-black-700"
                          type="button"
                        >
                          View reservation
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          </div>
        </div>
      </div>

    );
  };

  export default Hosting