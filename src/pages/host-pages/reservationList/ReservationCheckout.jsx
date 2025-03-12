import React from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { useEffect, useState } from 'react';

const ReservationCheckout = () => {
  
  //Call api for checkout reservations
  const [CheckoutReservations, setCheckoutReservations] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const fetchCheckoutReservations = async (user) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setCheckoutReservations(response.data.data.content.filter(reservation => reservation.status === 'Check_In'));
      } catch (error) {
        console.error("Error fetching checkout reservations data:", error);
      }
    };
    fetchCheckoutReservations(user);
  }
  , []);

  //Handle api change status for Check_In status reservation to Completed status
  const handleCheckout = async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'completed');
      formData.append('bookingId', id);
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}/update-status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCheckoutReservations(CheckoutReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking out reservation:", error);
    }
  }

  return (
    <div className='w-full'>
      {CheckoutReservations.length === 0 ? (
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {CheckoutReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.guest}</td>
                <td>{reservation.campsiteName}</td>
                <td>{reservation.campTypes}</td>
                <td>{reservation.services}</td>
                <td>{reservation.checkInDate}</td>
                <td>{reservation.checkOutDate}</td>
                <td>{reservation.status}</td>
                <td>
                  <button 
                  className="bg-green-500 text-white px-4 py-1 rounded-lg"
                  onClick={() => handleCheckout(reservation.id)}
                  disabled
                  >
                    Check out
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

export default ReservationCheckout