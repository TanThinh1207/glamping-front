import React from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TablePagination } from '@mui/material';

const ReservationCheckout = () => {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const modalRef = useRef();

  const formatVND = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  function mergeCampTypes(bookingDetail) {
    const mergedCampTypes = {};

    bookingDetail.bookingDetailResponseList.forEach(detail => {
      const campType = detail.campTypeResponse;
      if (!campType) return;

      const type = campType.type;
      const price = campType.price;

      const checkInDate = new Date(detail.checkInAt);
      const checkOutDate = new Date(detail.checkOutAt);
      const totalDays = Math.max((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24), 1);

      if (!mergedCampTypes[type]) {
        mergedCampTypes[type] = {
          ...campType,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      mergedCampTypes[type].totalQuantity += 1;
      const totalQuantity = mergedCampTypes[type].totalQuantity;
      console.log(totalQuantity);
      console.log(totalDays);
      mergedCampTypes[type].totalAmount = price * totalDays * totalQuantity;
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

  //Call api for checkout reservations
  const [checkoutReservations, setCheckoutReservations] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const fetchCheckoutReservations = async (user) => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
      setCheckoutReservations(checkoutReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking out reservation:", error);
    }
  }

  //Status color
  const statusColor = (status) => {
    switch (status) {
      case 'Check_In':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className='w-full'>
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <>
          {checkoutReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-black font-semibold text-lg">No results found</p>
              <p className="text-black mt-2">Please try a different filter</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
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
                  {checkoutReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
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
                count={checkoutReservations.length}
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
          <div ref={modalRef} className='bg-white shadow-md  w-3/5 h-4/5 relative rounded-xl'>
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
              <div className='w-1/2 p-6 flex flex-col'>
                <div>
                  <h1 className='text-4xl font-bold mb-4'>Booking details</h1>
                </div>
                <div className='mt-4 flex items-center space-x-4'>
                  <h1 className='text-lg font-semibold mb-2 text-green-500'>Check in date:  {selectedReservation.checkIn}</h1>
                  <h1 className='text-lg font-semibold mb-2'><FontAwesomeIcon icon={faChevronRight} /></h1>
                  <h1 className='text-lg font-semibold mb-2 text-red-500'>Check out date: {selectedReservation.checkOut}</h1>
                </div>
                <div className='overflow-y-auto h-full pr-4'>
                  <div className='border-b-2 border-gray-200 mt-4 pb-4'>
                    <h1 className='text-xl font-semibold mb-2'>Guest information</h1>
                    <div className='flex items-center space-x-4 shadow-xl bg-gray-100 p-4 rounded-xl'>
                      <FontAwesomeIcon icon={faUser} className='text-6xl' />
                      <div className='w-full'>
                        <h2 className='text-md font-bold'>Name: {selectedReservation.user.lastname} {selectedReservation.user.firstname}</h2>
                        <p className='text-md'>Mail: {selectedReservation.user.email}</p>
                        <p className='text-md'>Phone number: {selectedReservation.user.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 pb-4 border-b-2 border-gray-200'>
                    <h1 className='text-xl font-semibold mb-2'>Camp type </h1>
                    <div>
                      {mergeCampTypes(selectedReservation.bookingDetailResponseList).map((campType, index) => (
                        <div key={index} className="flex items-center space-x-9">
                          <div className="flex items-center space-x-4 shadow-xl bg-gray-100 rounded-xl mt-4 relative">
                            <div className="relative">
                              <div className="absolute left-1 right-1 bg-black bg-opacity-50 text-white text-center text-sm font-bold rounded-xl p-1">
                                {campType.type}
                              </div>
                              <img src={campType.image} alt="campType" className="w-20 h-20 object-cover rounded-lg" />
                            </div>
                          </div>
                          <div>
                            <h2 className="text-md font-bold">x{campType.totalQuantity}</h2>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <h1>Price:</h1>
                            <h2 className="text-md font-bold">{formatVND(campType.totalAmount)}</h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedReservation.bookingSelectionResponseList.length > 0 && (
                    <div className='mt-4 pb-4 border-b-2 border-gray-200'>
                      <div>
                        <h1 className='text-xl font-semibold mb-2'>Services </h1>
                      </div>
                      <div>
                        {selectedReservation.bookingSelectionResponseList.map((service, index) => (
                          <div key={index} className="flex items-center space-x-9">
                            <div className='w-20'>
                              <h1 className="text-md font-bold">{service.name}</h1>
                            </div>
                            <div>
                              <h2 className="text-md font-bold">x{service.quantity}</h2>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <h1>Price:</h1>
                              <h2 className="text-md font-bold">{formatVND(service.totalAmount)}</h2>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </div>
                <div className='mt-4 flex justify-between'>
                  <h1 className='text-xl font-semibold mb-2'>Total amount: {formatVND(selectedReservation.totalAmount)}</h1>
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded-lg'
                    onClick={() => handleCheckout(selectedReservation.id)}
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationCheckout