import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { TablePagination } from '@mui/material';

const ReservationCheckin = () => {

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

  //Call api for checkin reservations
  const [checkinReservations, setCheckinReservations] = useState([]);
  useEffect(() => {
    const fetchCheckinReservations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setCheckinReservations(response.data.data.content.filter(reservation => reservation.status === 'Accepted'));
      } catch (error) {
        console.error("Error fetching checkin reservations data:", error);
      }
    };
    fetchCheckinReservations();
  }
    , []);

  //Handle api change status for Accepted status reservation to Checkin status
  const handleCheckin = async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'checkin');
      formData.append('bookingId', id);
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}/update-status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCheckinReservations(checkinReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking in reservation:", error);
    }
  }

  //Status color
  const statusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className='w-full'>
      {checkinReservations.length === 0 ? (
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
                <th className='text-center py-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {checkinReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
                <tr key={index}>
                  <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                  <td className='text-left py-4'>{reservation.user.phone}</td>
                  <td className='text-left py-4'>{reservation.user.email}</td>
                  <td className='text-left py-4'>{reservation.campSite.name}</td>
                  <td className={`text-center py-4 font-bold ${statusColor(reservation.status)}`}>{reservation.status}</td>
                  <td className='text-center py-4 space-x-4'>
                    <button
                      className='bg-green-500 text-white px-4 py-2 rounded-lg'
                      onClick={() => handleCheckin(reservation.id)}
                    >
                      Check in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={checkinReservations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            className='p-4'
          />
        </div>
      )}
    </div>
  )
}

export default ReservationCheckin