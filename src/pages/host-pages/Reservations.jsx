import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Reservations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = ["Upcoming", "Checking in", "Checking out", "Completed", "Canceled", "All"];
  return (
    <div className='w-full h-screen bg-white px-20 py-4'>
      <div>
        <h1 className='text-4xl font-semibold py-8'>Your reservations</h1>
      </div>
      <div className="flex border-b space-x-6">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === `/hosting/reservations/${tab.toLowerCase().replace(/\s+/g, "-")}` ||
            (tab === "Upcoming" && location.pathname === "/hosting/reservations");

          return (
            <button
              key={tab}
              className={`pb-2 text-lg font-medium ${
                isActive ? "border-b-2 border-black text-black" : "text-gray-500"
              }`}
              onClick={() => navigate(`/hosting/reservations/${tab.toLowerCase().replace(/\s+/g, "-")}`)}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className='border-b w-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default Reservations