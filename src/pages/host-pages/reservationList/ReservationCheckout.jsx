import React from 'react'

const ReservationCheckout = () => {
  const CheckoutReservations = [
  ];
  return (
    <div className='w-full'>
      {CheckoutReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60">
          <p className="text-black font-semibold text-lg">No results found</p>
          <p className="text-black mt-2">Please try a different filter</p>
        </div>
      ) : (
        <table></table>
      )}
    </div>
  )
}

export default ReservationCheckout