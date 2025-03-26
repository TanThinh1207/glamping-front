import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { TablePagination } from '@mui/material';


const ReservationCanceled = () => {
  const [loading, setLoading] = useState(true);
  const [canceledReservations, setCanceledReservations] = useState([]);
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const accessToken = localStorage.getItem('accessToken');

  //Table Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Call api for canceled reservations
  useEffect(() => {
    const fetchCanceledReservations = async (user) => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            hostId: user.id,
            status: 'Refund',
          }
        });
        setCanceledReservations(response.data.data.content);
      } catch (error) {
        console.error("Error fetching canceled reservations data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCanceledReservations(user);
  }
    , []);
  return (
    <div className='w-full'>
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <>
          {canceledReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-black font-semibold text-lg">No results found</p>
              <p className="text-black mt-2">Please try a different filter</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-left py-4'>Guest</th>
                    <th className='text-left py-4'>Phone Number</th>
                    <th className='text-left py-4'>Email</th>
                    <th className='text-left py-4'>Campsite's name</th>
                    <th className='text-center py-4'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {canceledReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation) => (
                    <tr key={reservation.id}>
                      <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                      <td className='text-left py-4'>{reservation.user.phone}</td>
                      <td className='text-left py-4'>{reservation.user.email}</td>
                      <td className='text-left py-4'>{reservation.campSite.name}</td>
                      <td className='text-center py-4 text-red-500 font-bold'>{reservation.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                component="div"
                count={canceledReservations.length}
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
    </div>
  )
}

export default ReservationCanceled