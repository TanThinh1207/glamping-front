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
              <th>Guest</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Campsite's name</th>
              <th>Camp types</th>
              <th className='text-center'>Status</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {UpcomingReservations.map((reservation, index) => (
              <tr key={index}>
                <td>{reservation.guest}</td>
                <td>{reservation.phoneNumber}</td>
                <td>{reservation.email}</td>
                <td>{reservation.campsiteName}</td>
                <td>{reservation.campTypes}</td>
                <td className='text-center'>{reservation.status}</td>
                <td className='text-center'>
                  <button className='bg-blue-500 text-white px-4 py-1 rounded-lg'>Accept</button>
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