import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const BookingDetail = ({ selectedReservation, setSelectedReservation, refreshReservations }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(selectedReservation?.id);
  const [totalRefund, setTotalRefund] = useState(selectedReservation?.totalAmount);
  const modalRef = useRef(null);
  const [reason, setReason] = useState('');

  // Format VND for price
  const formatVND = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  //Handle close pop-up
  const handleClosePopUp = () => {
    setIsOpen(false);
    setReason('');
    setTotalRefund(0);
  }

  //Handle Click outside of pop-up
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



  // Merge camp types
  function mergeCampTypes(bookingDetail) {
    const mergedCampTypes = {};
    console.log(bookingDetail);
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

  //Handle api change status for Deposit status reservation to Refund status
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
      handleClosePopUp();
      setSelectedReservation(null);
      refreshReservations();
    } catch (error) {
      console.error('Error declining reservation:', error);
    } finally {
      setLoading(false);
    }
  }

  //Handle api change status for Deposit status reservation to Accepted status
  const handleAccept = async (id) => {
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}?status=accept`);
      setSelectedReservation(null);
      refreshReservations();
    } catch (error) {
      console.error('Error accepting reservation:', error);
    } finally {
      setLoading(false);
    }
  }

  //Handle api change status for Accepted status reservation to Check_In status
  const handleCheckin = async (id) => {
    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}?status=checkin`);
      setSelectedReservation(null);
      refreshReservations();
    } catch (error) {
      console.error('Error checking in reservation:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Button
  const handleButton = (status) => {
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
              className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg ml-2'
              disabled
            >
              Decline
            </button>
          </>
        );
      case 'Deposit':
        return (
          <>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded-lg'
              onClick={() => {
                handleAccept(id);
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
        );
      case 'Accepted':
        return (
          <>
            <button
              className='bg-green-500 text-white px-4 py-2 rounded-lg'
              onClick={() => handleCheckin(selectedReservation.id)}
            >
              Check in
            </button>
          </>
        );
    }
  }
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>

      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <div ref={modalRef} className='bg-white shadow-md w-3/5 h-4/5 relative rounded-xl'>
          <button
            className="absolute -top-0 -right-0 text-xl p-1"
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
                    {mergeCampTypes(selectedReservation).map((campType, index) => (
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
                <div>
                  {handleButton(selectedReservation.status)}
                </div>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div ref={modalRef} className='bg-white shadow-lg p-6 lg:w-2/4 relative rounded-xl'>
                <div>
                  <h1 className='text-4xl font-bold mb-4'>Total refund: {formatVND(totalRefund)} </h1>
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
                    className={`px-4 py-2 rounded-lg ${reason.trim() ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => handleDeny(id, reason)}
                    disabled={!reason.trim()}
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
  );
};

export default BookingDetail;
