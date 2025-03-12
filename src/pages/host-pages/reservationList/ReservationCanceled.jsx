import React from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { useEffect, useState } from 'react';


const ReservationCanceled = () => {
  
  //Call api for canceled reservations
  const [CanceledReservations, setCanceledReservations] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const fetchCanceledReservations = async (user) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setCanceledReservations(response.data.data.content.filter(reservation => reservation.status === 'Refund'));
      } catch (error) {
        console.error("Error fetching canceled reservations data:", error);
      }
    };
    fetchCanceledReservations(user);
  }
  , []);
  return (
    <div className='w-full'>
      {CanceledReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-black font-semibold text-lg">No results found</p>
          <p className="text-black mt-2">Please try a different filter</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Campsite's name</th>
              <th>Camp types</th>
              <th>Services</th>
              <th>Check in date</th>
              <th>Check out date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CanceledReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.guest}</td>
                <td>{reservation.campsiteName}</td>
                <td>{reservation.campTypes}</td>
                <td>{reservation.services}</td>
                <td>{reservation.checkInDate}</td>
                <td>{reservation.checkOutDate}</td>
                <td>{reservation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReservationCanceled