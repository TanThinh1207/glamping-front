import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'


const ReservationUpcoming = () => {
  const [UpcomingReservations, setUpcomingReservations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [id, setId] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClosePopUp();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchUpcomingReservations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUpcomingReservations(response.data.data.content.filter(reservation => reservation.status === 'Pending' || reservation.status === 'Deposit'));
      } catch (error) {
        console.error('Error fetching upcoming reservations:', error);
      }
    }
    fetchUpcomingReservations();
  }, []);

  const handleAccept = async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'accept');
      formData.append('bookingId', id);
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}/update-status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUpcomingReservations(UpcomingReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('Error accepting reservation:', error);
    }
  }

  const handleDeny = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}/update`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setUpcomingReservations(UpcomingReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('Error declining reservation:', error);
    }
  }

  const handleButton = (id, status) => {
    switch (status) {
      case 'Pending':
        return (
          <>
            <button
              className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg'
              disabled
            >
              Accept
            </button>
            <button
              className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg'
              disabled
            >
              Decline
            </button>
          </>
        )
      case 'Deposit':
        return (
          <>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded-lg'
              onClick={() => handleAccept(id)}
            >
              Accept
            </button>
            <button
              className='px-4 py-2 bg-red-500 text-white rounded-lg'
              onClick={() => {
                setId(id);
                setIsOpen(true);
              }}
            >
              Decline
            </button>
          </>
        )
    }
  }

  return (
    <div className='w-full'>
      {UpcomingReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-black font-semibold text-lg">You have no upcoming reservations</p>
          <a href="/hosting/reservations/all" className="text-black underline mt-2">
            See all reservations
          </a>
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
            {UpcomingReservations.map((reservation, index) => (
              <tr key={index}>
                <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                <td className='text-left py-4'>{reservation.user.phone}</td>
                <td className='text-left py-4'>{reservation.user.email}</td>
                <td className='text-left py-4'>{reservation.campSite.name}</td>
                <td className='text-center py-4'>{reservation.status}</td>
                <td className='text-center py-4 space-x-4'>
                  {handleButton(reservation.id, reservation.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div>
              <h1 className='text-xl font-semibold mb-2'>Tell us the reason why you deny</h1>
              <textarea
                className='w-full h-32 border-2 rounded-xl border-gray-200 p-2'
                placeholder='Enter your reason'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className='text-right mt-4'>
              <button
                className='px-4 py-2 bg-red-500 text-white rounded-lg '
                onClick={() => handleDeny(id, reason)}
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationUpcoming