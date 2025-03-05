import React from 'react'

const ReservationUpcoming = () => {
  const UpcomingReservations = [
    {
      guest: 'John Doe',
      phoneNumber: '1234567890',
      email: "hehe@gmail.com",
      campsiteName: 'Campsite A',
      campTypes: 'Tent',
      status: 'Deposited'
    },
    {
      guest: 'Jane Doe',
      phoneNumber: '1234567890',
      email: "huhu@gmail.com",
      campsiteName: 'Campsite B',
      campTypes: 'RV',
      status: 'Deposited'
    },
    {
      guest: 'John Smith',
      phoneNumber: '1234567890',
      email: "huhuhe@gmail.com",
      campsiteName: 'Campsite C',
      campTypes: 'Tent',
      status: 'Deposited'
    },
  ];
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
              <th className='text-left py-4'>Camp types</th>
              <th className='text-center py-4'>Status</th>
              <th className='text-center py-4'>Action</th>
            </tr>
          </thead>
          <tbody>
            {UpcomingReservations.map((reservation, index) => (
              <tr key={index}>
                <td className='text-left py-4'>{reservation.guest}</td>
                <td className='text-left py-4'>{reservation.phoneNumber}</td>
                <td className='text-left py-4'>{reservation.email}</td>
                <td className='text-left py-4'>{reservation.campsiteName}</td>
                <td className='text-left py-4'>{reservation.campTypes}</td>
                <td className='text-center py-4'>{reservation.status}</td>
                <td className='text-center py-4 space-x-4'>
                  <button className='bg-green-500 text-white px-4 py-2 rounded-lg'>Accept</button>
                  <button className='bg-red-500 text-white px-4 py-2 rounded-lg '>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ReservationUpcoming