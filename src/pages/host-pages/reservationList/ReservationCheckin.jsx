import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ReservationCheckin = () => {
  const [checkinReservations, setCheckinReservations] = useState([]);
  useEffect(() => {
    const fetchCheckinReservations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setCheckinReservations(response.data.data.content.filter(reservation => reservation.status === 'Accepted'));
      } catch (error) {
        console.error("Error fetching checkin reservations data:", error);
      }
    };
    fetchCheckinReservations();
  }
  , []);

  const handleCheckin = async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'checkin');
      formData.append('bookingId', id);
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}/update-status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCheckinReservations(checkinReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking in reservation:", error);
    }
  }

  return (
    <div className='w-full'>
      {checkinReservations.length === 0 ? (
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
            {checkinReservations.map((reservation, index) => (
              <tr key={index}>
                <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                <td className='text-left py-4'>{reservation.user.phone}</td>
                <td className='text-left py-4'>{reservation.user.email}</td>
                <td className='text-left py-4'>{reservation.campSite.name}</td>
                <td className='text-center py-4'>{reservation.status}</td>
                <td className='text-center py-4 space-x-4'>
                  <button 
                  className='bg-green-500 text-white px-4 py-2 rounded-lg'
                  onClick={() => handleCheckin(reservation.id)}
                  >
                    Check in
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReservationCheckin