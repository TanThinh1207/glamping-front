import React from 'react'

const ReservationAll = () => {
  const AllReservations = [
  ];
  return (
    <div className='w-full'>
      {AllReservations.length === 0 ? (
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
            {AllReservations.map((reservation, index) => (
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

export default ReservationAll