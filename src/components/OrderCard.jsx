import React from 'react';
import { format, differenceInDays } from 'date-fns';

const OrderCard = ({ booking }) => {
  // Calculate nights between check-in and check-out
  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
  
  // Calculate total selection amount (extra services)
  const totalSelectionAmount = booking.bookingSelectionResponseList.reduce(
    (sum, selection) => sum + parseFloat(selection.totalAmount), 
    0
  );
  
  // Calculate deposit amount
  const depositRate = booking.campSite.depositRate || 0.2;
  const depositAmount = booking.totalAmount * depositRate;
  
  // Determine paid amount based on status
  const paidAmount = booking.status === "Completed" 
    ? booking.totalAmount 
    : depositAmount;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Header with campsite name and status */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-canto text-2xl">🏕️ {booking.campSite.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`px-3 py-1 text-sm rounded-full ${
              booking.status === "Completed" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {booking.status}
            </span>
          </div>
        </div>
      </div>
      
      {/* Booking details section */}
      <div className="p-4 bg-white">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-500 font-canto">Check-In</p>
            <p className="font-medium">{format(new Date(booking.checkIn), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Check-Out</p>
            <p className="font-medium">{format(new Date(booking.checkOut), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Duration</p>
            <p className="font-medium">{nights} nights</p>
          </div>
          <div>
            <p className="text-gray-500 font-canto">Book Date</p>
            <p className="font-medium">{format(new Date(booking.createdAt), "dd MMM yyyy")}</p>
          </div>
        </div>
        
        {/* Camp types section */}
        <div className="mb-4">
          <h4 className="text-sm uppercase tracking-wider text-gray-500 font-canto mb-2">Camp Types</h4>
          <div className="space-y-3">
            {/* Group by camp type */}
            {Object.values(booking.bookingDetailResponseList.reduce((acc, detail) => {
              const type = detail.campTypeResponse?.type;
              if (!type) return acc;
              
              if (!acc[type]) {
                acc[type] = {
                  ...detail.campTypeResponse,
                  totalQuantity: 0,
                  totalAmount: 0
                };
              }
              
              acc[type].totalQuantity += 1;
              acc[type].totalAmount += detail.amount;
              
              return acc;
            }, {})).map((campType, index) => (
              <div key={index} className="flex items-center border-b border-gray-100 pb-3">
                <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded">
                  <img 
                    src={campType.image} 
                    alt={campType.type} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="font-canto text-xl">{campType.type}</h5>
                  <div className="flex gap-2">
                    <span className="text-gray-500 font-canto text-lg">Capacity: {campType.capacity} persons</span>
                    <span>•</span>
                    <span className="text-gray-500 font-canto text-lg">Per Night: {campType.price.toLocaleString("vi-VN")}VND</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <div className="font-canto text-lg">x{campType.totalQuantity}</div>
                  <div className="text-purple-900 font-canto text-lg">{campType.totalAmount.toLocaleString("vi-VN")}VND</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Extra services section - only if there are services */}
        {booking.bookingSelectionResponseList.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg uppercase tracking-wider text-gray-500 font-canto mb-2">Extra Services</h4>
            <div className="space-y-2">
              {booking.bookingSelectionResponseList.map((selection, index) => (
                <div key={index} className="flex justify-between text-sm pb-1">
                  <span className='font-canto text-lg'>{selection.name}</span>
                  <div>
                    <span className="text-gray-500 mr-3 font-canto text-lg">x{selection.quantity}</span>
                    <span className='font-canto text-lg text-purple-900'>{(parseFloat(selection.totalAmount) / parseFloat(selection.quantity)).toLocaleString("vi-VN")}VND</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Payment summary */}
        <div className="mt-6 pt-4 border-t border-gray-200 font-canto text-xl">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Services</span>
            <span className='text-gray-600'>{totalSelectionAmount.toLocaleString("vi-VN")}VND</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Accommodations</span>
            <span className='text-gray-600'>{(booking.totalAmount - totalSelectionAmount).toLocaleString("vi-VN")}VND</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Booking Price</span>
            <span className='text-purple-900'>{booking.totalAmount.toLocaleString("vi-VN")}VND</span>
          </div>
          <hr />
          <div className="flex justify-between text-purple-900 font-medium">
            <span>Paid Amount</span>
            <span>{paidAmount.toLocaleString("vi-VN")}VND</span>
          </div>
          
          {booking.status !== "Completed" && (
            <div className="mt-2 text-xs text-gray-500 text-right">
              * {Math.round(depositRate * 100)}% deposit paid
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;