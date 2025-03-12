import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { TablePagination } from '@mui/material';
import { useUser } from '../../../context/UserContext';

const ReservationUpcoming = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState('');
  const { user } = useUser();
  const [totalRefund, setTotalRefund] = useState(0);

  //Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Handle Click outside of pop-up
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

  //Call api for upcoming reservations
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  useEffect(() => {
    const fetchUpcomingReservations = async (user) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setUpcomingReservations(response.data.data.content.filter(reservation => reservation.status === 'Pending' || reservation.status === 'Deposit'));
      } catch (error) {
        console.error('Error fetching upcoming reservations:', error);
      }
    }
    fetchUpcomingReservations(user);
  }, []);

  //Handle api change status for Deposit status reservation to Accepted status
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
      setUpcomingReservations(upcomingReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('Error accepting reservation:', error);
    }
  }


  //Handle api change status for Deposit status reservation to Refund status
  const [reason, setReason] = useState('');
  const handleDeny = async (id, reason) => {
    try {
      console.log(id, reason);
      const formData = new FormData();
      formData.append('bookingId', id);
      formData.append('message', reason);
      await axios.post(`${import.meta.env.VITE_API_PAYMENT_REFUND}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      setUpcomingReservations(upcomingReservations.filter(reservation => reservation.id !== id));
      handleClosePopUp();
    } catch (error) {
      console.error('Error declining reservation:', error);
    }
  }

  //Handle close pop-up
  const handleClosePopUp = () => {
    setIsOpen(false);
    setReason('');
    setTotalRefund(0);
  }

  //Handle button of action
  const handleButton = (id, status, totalRefund) => {
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
                setTotalRefund(totalRefund)
                setIsOpen(true);
              }}
            >
              Decline
            </button>
          </>
        )
    }
  }

  //Handle status color
  const statusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-orange-500';
      case 'Deposit':
        return 'text-green-500';
    }
  }

  return (
    <div className='w-full'>
      {upcomingReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-black font-semibold text-lg">You have no upcoming reservations</p>
          <a href="/hosting/reservations/all" className="text-black underline mt-2">
            See all reservations
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
              {upcomingReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
                <tr key={index}>
                  <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                  <td className='text-left py-4'>{reservation.user.phone}</td>
                  <td className='text-left py-4'>{reservation.user.email}</td>
                  <td className='text-left py-4'>{reservation.campSite.name}</td>
                  <td className={`text-center py-4 font-bold ${statusColor(reservation.status)}`}>{reservation.status}</td>
                  <td className='text-center py-4 space-x-4'>
                    {handleButton(reservation.id, reservation.status, reservation.paymentResponseList[0]?.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={upcomingReservations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            className='p-4'
          />
        </div>
      )}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
            <div>
              <h1 className='text-4xl font-bold mb-4'>Total refund: {totalRefund} VND </h1>
            </div>
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
                className='px-4 py-2 bg-green-500 text-white rounded-lg '
                onClick={() => handleDeny(id, reason)}
              >
                Refund
              </button>
              <button
                className='px-4 py-2 bg-red-500 text-white rounded-lg ml-2'
                onClick={handleClosePopUp}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationUpcoming