import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { TablePagination } from '@mui/material';
import { useUser } from '../../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ReservationUpcoming = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState('');
  const { user } = useUser();
  const [totalRefund, setTotalRefund] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  function mergeCampTypes(bookingDetailResponseList) {
    const mergedCampTypes = {};

    bookingDetailResponseList.forEach(detail => {
      const campType = detail.campTypeResponse;
      if (!campType) return;

      const type = campType.type;
      const price = campType.price; // Giá cơ bản trong ngày thường
      const weekendRate = campType.weekendRate; // Giá vào cuối tuần

      if (!mergedCampTypes[type]) {
        mergedCampTypes[type] = {
          ...campType,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      mergedCampTypes[type].totalQuantity += 1;

      // Tính tiền dựa trên số lượng và giá tiền (giả sử check-in có cả ngày thường và cuối tuần)
      const totalDays = 2; // Ví dụ ở đây từ 15 đến 17 là 2 ngày
      const weekendDays = 1; // Giả sử có 1 ngày cuối tuần
      const normalDays = totalDays - weekendDays;

      const totalAmount = (normalDays * price + weekendDays * weekendRate);
      mergedCampTypes[type].totalAmount += totalAmount;
    });
    console.log(mergedCampTypes);
    return Object.values(mergedCampTypes);
  }

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
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingReservations(user);
  }, []);

  //Handle api change status for Deposit status reservation to Accepted status
  const handleAccept = async (id) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }


  //Handle api change status for Deposit status reservation to Refund status
  const [reason, setReason] = useState('');
  const handleDeny = async (id, reason) => {
    setLoading(true);
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
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error declining reservation:', error);
    } finally {
      setLoading(false);
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
              onClick={() => {
                handleAccept(id);
                setSelectedReservation(null);
              }}
            >
              Accept
            </button>
            <button
              className='px-4 py-2 bg-red-500 text-white rounded-lg ml-2'
              onClick={() => {
                setId(id);
                setTotalRefund(totalRefund);
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
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 group"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        console.log(reservation);
                      }}
                    >
                      <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                      <td className='text-left py-4'>{reservation.user.phone}</td>
                      <td className='text-left py-4'>{reservation.user.email}</td>
                      <td className='text-left py-4'>{reservation.campSite.name}</td>
                      <td className={`text-center py-4 font-bold ${statusColor(reservation.status)}`}>{reservation.status}</td>
                      <td>
                        <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
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

        </>
      )}
      {selectedReservation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-lg  w-3/5 h-4/5 relative rounded-xl'>
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-xl p-1 rounded-full"
              onClick={() => setSelectedReservation(null)}
            >
              ✖
            </button>
            <div className='flex space-x-4 w-full h-full'>
              <div className='relative w-1/2 h-full'>
                <div className='absolute bg-black bg-opacity-50 text-white text-xl font-bold px-4 py-2 rounded-lg'>
                  {selectedReservation.campSite.name}
                </div>
                <img src={selectedReservation.campSite.imageList[0].path} alt='campsite' className='w-auto h-full object-cover rounded-l-xl ' />
              </div>
              <div className='w-1/2 p-6'>
                <div>
                  <h1 className='text-4xl font-bold mb-4'>Booking details</h1>
                </div>
                <div className='mt-4 flex items-center space-x-4'>
                  <h1 className='text-lg font-semibold mb-2 text-green-500'>Check in date:  {selectedReservation.checkIn}</h1>
                  <h1 className='text-lg font-semibold mb-2'><FontAwesomeIcon icon={faChevronRight} /></h1>
                  <h1 className='text-lg font-semibold mb-2 text-red-500'>Check out date: {selectedReservation.checkOut}</h1>
                </div>
                <div>
                  <h1 className='text-xl font-semibold mb-2'>Guest information</h1>
                  <div className='flex items-center space-x-4 shadow-xl bg-gray-100 p-4 rounded-xl'>
                    <FontAwesomeIcon icon={faUser} className='text-7xl' />
                    <div className='w-full'>
                      <h2 className='text-lg font-bold'>Name: {selectedReservation.user.lastname} {selectedReservation.user.firstname}</h2>
                      <p className='text-lg'>Mail: {selectedReservation.user.email}</p>
                      <p className='text-lg'>Phone number: {selectedReservation.user.phone}</p>
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex items-center space-x-4'>
                  <div>
                    <div>
                      <h1 className='text-xl font-semibold mb-2'>Camp type </h1>
                    </div>
                    <div>
                      {mergeCampTypes(selectedReservation.bookingDetailResponseList).map((campType, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4 shadow-xl bg-gray-100 rounded-xl mt-4 relative">
                            <div className="relative">
                              <div className="absolute left-1 right-1 bg-black bg-opacity-50 text-white text-center text-sm font-bold rounded-xl p-1">
                                {campType.type}
                              </div>
                              <img src={campType.image} alt="campType" className="w-20 h-20 object-cover rounded-lg" />
                            </div>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold">x{campType.totalQuantity}</h2>
                          </div>
                          <div>
                            <h1>Price:</h1>
                            <h2 className="text-lg font-bold">{campType.totalAmount} VND</h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedReservation.bookingSelectionResponseList.length > 0 && (
                    <div>
                      <div>
                        <h1 className='text-xl font-semibold mb-2'>Services </h1>
                      </div>
                      <div>
                        {selectedReservation.bookingSelectionResponseList.map((service, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div>
                              <h1 className="text-lg font-bold">{service.name}</h1>
                            </div>
                            <div>
                              <h2 className="text-lg font-bold">x{service.quantity}</h2>
                            </div>
                            <div>
                              <h2 className="text-lg font-bold">Price: {service.totalAmount} VND</h2>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className='mt-4'>
                  <h1 className='text-xl font-semibold mb-2'>Total amount: {selectedReservation.totalAmount} VND</h1>
                </div>
                <div className='text-right mt-4'>
                  {handleButton(selectedReservation.id, selectedReservation.status, selectedReservation.paymentResponseList[0]?.totalAmount)}
                </div>
              </div>
            </div>
          </div>
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
      )}
    </div>
  )
}

export default ReservationUpcoming