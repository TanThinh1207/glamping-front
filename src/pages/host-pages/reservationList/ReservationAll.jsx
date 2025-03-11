import React, { useEffect, useState } from 'react'
import axios from 'axios';
const ReservationAll = () => {
  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setAllReservations(response.data.data.content);
      } catch (error) {
        console.error("Error fetching reservations data:", error);
      }
    };
    fetchReservations();
  }
  , []);
  return (
    <div className='w-full'>
      {allReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-black font-semibold text-lg">No results found</p>
          <p className="text-black mt-2">Please try a different filter</p>
        </div>
      ) : (
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='text-left py-4'>Guest</th>
              <th className='text-left py-4'>Phone Number</th>
              <th className='text-left py-4'>Email</th>
              <th className='text-left py-4'>Campsite's name</th>
              <th className='text-center py-4'>Status</th>
              <th className='text-center py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {allReservations.map((reservation, index) => (
              <tr key={index}>
                <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                <td className='text-left py-4'>{reservation.user.phone}</td>
                <td className='text-left py-4'>{reservation.user.email}</td>
                <td className='text-left py-4'>{reservation.campSite.name}</td>
                <td className='text-center py-4'>{reservation.status}</td>
                <td className='text-center py-4 space-x-4'>
                  <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>Accept</button>
                  <button className='bg-red-500 text-white px-4 py-2 rounded-lg '>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReservationAll