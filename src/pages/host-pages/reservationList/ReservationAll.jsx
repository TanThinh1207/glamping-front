import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { TablePagination } from '@mui/material';

const ReservationAll = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Table Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Call api for all reservations
  useEffect(() => {
    const fetchReservations = async (user) => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setAllReservations(response.data.data.content);
      } catch (error) {
        console.error("Error fetching reservations data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations(user);
  }
    , []);
  
    const statusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Completed':
        return 'text-purple-900';
      case 'Refund':
        return 'text-red-500';
      case 'Deposit':
        return 'text-yellow-500';
      case 'Check_In':
        return 'text-green-500';
      default:
        return 'text-orange-500';
    }
  }
  return (
    <div className='w-full'>
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <>
          {allReservations.length === 0 ? (
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
                  {allReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation) => (
                    <tr key={reservation.id}>
                      <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                      <td className='text-left py-4'>{reservation.user.phone}</td>
                      <td className='text-left py-4'>{reservation.user.email}</td>
                      <td className='text-left py-4'>{reservation.campSite.name}</td>
                      <td className={`text-center py-4 font-bold ${statusColor(reservation.status)}`}>{reservation.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                component="div"
                count={allReservations.length}
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

export default ReservationAll