import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { TablePagination } from '@mui/material';
import { useUser } from '../../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import BookingDetail from '../../../components/BookingDetail';

const ReservationUpcoming = () => {
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
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

  //Call api for upcoming reservations
  const fetchUpcomingReservations = async () => {
    setLoading(true);
    try {
      console.log(user.id);
      const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          hostId: user.id,
          status: 'Deposit',
        }
      });

      setUpcomingReservations(response.data.data.content);
      console.log(upcomingReservations);
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingReservations();
  }, []);

  //Handle status color
  const statusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-orange-500';
      case 'Deposit':
        return 'text-green-500';
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
          {upcomingReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60">
              <p className="text-black font-semibold text-lg">You have no upcoming reservations</p>
              <a href="/hosting/reservations/all" className="text-black underline mt-2">
                See all reservations
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className='w-full text-left'>
                <thead>
                  <tr>
                    <th className='text-left py-4'>Guest</th>
                    <th className='text-left py-4'>Phone Number</th>
                    <th className='text-left py-4'>Email</th>
                    <th className='text-left py-4'>Campsite's name</th>
                    <th className='text-center py-4'>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 group"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        console.log(reservation);
                      }}
                    >
                      <td className='text-left py-4'>{reservation.user.lastname} {reservation.user.firstname}</td>
                      <td className='text-left py-4'>{reservation.user.phone}</td>
                      <td className='text-left py-4'>{reservation.user.email}</td>
                      <td className='text-left py-4'>{reservation.campSite.name}</td>
                      <td className={`text-center py-4 font-bold ${statusColor(reservation.status)}`}>{reservation.status}</td>
                      <td>
                        <FontAwesomeIcon icon={faChevronRight} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                component="div"
                count={upcomingReservations.length}
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
      {selectedReservation && (
        <BookingDetail
          selectedReservation={selectedReservation}
          setSelectedReservation={setSelectedReservation}
          refreshReservations={fetchUpcomingReservations}
        />
      )}
    </div>
  )
}

export default ReservationUpcoming