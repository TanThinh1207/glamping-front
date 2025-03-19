import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { TablePagination } from '@mui/material';
import { useUser } from '../../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faUser } from '@fortawesome/free-solid-svg-icons';
import BookingDetail from '../../../components/BookingDetail';

const ReservationCheckin = () => {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [checkinReservations, setCheckinReservations] = useState([]);
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

  //Call api for checkin reservations
    const fetchCheckinReservations = async () => {
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
        setCheckinReservations(response.data.data.content.filter(reservation => reservation.status === 'Accepted'));
      } catch (error) {
        console.error("Error fetching checkin reservations data:", error);
      } finally {
        setLoading(false);
      }
    };
 
  useEffect(() => {
    fetchCheckinReservations();
  }, []);

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
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
        </div>
      ) : (
        <>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {checkinReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
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
        </>
      )}
      {selectedReservation && (
        <BookingDetail
        selectedReservation={selectedReservation}
        setSelectedReservation={setSelectedReservation}
        refreshReservations={fetchCheckinReservations}
        />
      )}
    </div>
  )
}

export default ReservationCheckin