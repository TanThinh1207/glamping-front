import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faUser } from '@fortawesome/free-solid-svg-icons';

const BookingDetail = ({ selectedReservation, onClose, handleCheckout }) => {
  const modalRef = useRef();

  function mergeCampTypes(bookingDetailResponseList) {
    const mergedCampTypes = {};

    bookingDetailResponseList.forEach(detail => {
      const campType = detail.campTypeResponse;
      if (!campType) return;

      const type = campType.type;
      const price = campType.price;
      const weekendRate = campType.weekendRate;

      if (!mergedCampTypes[type]) {
        mergedCampTypes[type] = {
          ...campType,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      mergedCampTypes[type].totalQuantity += 1;
      const totalDays = 2;
      const weekendDays = 1;
      const normalDays = totalDays - weekendDays;
      const totalAmount = (normalDays * price + weekendDays * weekendRate);
      mergedCampTypes[type].totalAmount += totalAmount;
    });
    return Object.values(mergedCampTypes);
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div ref={modalRef} className='bg-white shadow-md w-3/5 h-4/5 relative rounded-xl'>
        <button className="absolute -top-2 -right-2 bg-red-500 text-xl p-1 rounded-full" onClick={onClose}>✖</button>
        <div className='flex space-x-4 w-full h-full'>
          <div className='relative w-1/2 h-full'>
            <div className='absolute bg-black bg-opacity-50 text-white text-xl font-bold px-4 py-2 rounded-lg'>
              {selectedReservation.campSite.name}
            </div>
            <img src={selectedReservation.campSite.imageList[0].path} alt='campsite' className='w-auto h-full object-cover rounded-l-xl' />
          </div>
          <div className='w-1/2 p-6 flex flex-col'>
            <h1 className='text-4xl font-bold mb-4'>Booking details</h1>
            <div className='mt-4 flex items-center space-x-4'>
              <h1 className='text-lg font-semibold text-green-500'>Check-in: {selectedReservation.checkIn}</h1>
              <FontAwesomeIcon icon={faChevronRight} />
              <h1 className='text-lg font-semibold text-red-500'>Check-out: {selectedReservation.checkOut}</h1>
            </div>
            <div className='overflow-y-auto h-full pr-4'>
              <div className='border-b-2 border-gray-200 mt-4 pb-4'>
                <h1 className='text-xl font-semibold mb-2'>Guest Information</h1>
                <div className='flex items-center space-x-4 shadow-xl bg-gray-100 p-4 rounded-xl'>
                  <FontAwesomeIcon icon={faUser} className='text-6xl' />
                  <div>
                    <h2 className='text-md font-bold'>Name: {selectedReservation.user.lastname} {selectedReservation.user.firstname}</h2>
                    <p>Email: {selectedReservation.user.email}</p>
                    <p>Phone: {selectedReservation.user.phone}</p>
                  </div>
                </div>
              </div>
              <div className='mt-4 pb-4 border-b-2 border-gray-200'>
                <h1 className='text-xl font-semibold mb-2'>Camp Types</h1>
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
                    <h2 className="text-md font-bold">x{campType.totalQuantity}</h2>
                    <div className='flex items-center space-x-2'>
                      <h1>Price:</h1>
                      <h2 className="text-md font-bold">{campType.totalAmount} VND</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='mt-4 flex justify-between'>
              <h1 className='text-xl font-semibold'>Total: {selectedReservation.totalAmount} VND</h1>
              <button className='bg-green-500 text-white px-4 py-2 rounded-lg' onClick={() => handleCheckout(selectedReservation.id)}>Check out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
