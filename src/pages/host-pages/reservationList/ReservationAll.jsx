import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';

const ReservationAll = () => {
  const [allReservations, setAllReservations] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const fetchReservations = async (user) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setAllReservations(response.data.data.content);
      } catch (error) {
        console.error("Error fetching reservations data:", error);
      }
    };
    fetchReservations(user);
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReservationAll