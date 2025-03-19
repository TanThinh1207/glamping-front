import React from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TablePagination } from '@mui/material';

const ReservationCheckout = () => {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const modalRef = useRef();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checkoutReservations, setCheckoutReservations] = useState([]);
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [finalpayment, setFinalPayment] = useState(0);
  const [newOrder, setNewOrder] = useState(
    {
      name: '',
      quantity: '',
      price: '',
      totalAmount: '',
      note: ''
    }
  );

  const calculateTotalAmount = () => {
    if (!selectedReservation) {
      console.log("selectedReservation is null");
      return 0;
    }
  
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    console.log("Total Amount:", selectedReservation.totalAmount, "Deposit:", selectedReservation.depositAmount, "Orders Total:", totalOrderAmount);
    
    return (selectedReservation.totalAmount - selectedReservation.paymentResponseList[0].totalAmount) + totalOrderAmount;
  };

  // Function to add new order to the list
  const handleAddOrder = () => {
    if (newOrder.name.trim() === '') return;

    setOrders([...orders, { ...newOrder }]);
    setNewOrder({ name: '', quantity: '', price: '', totalAmount: '', note: '' });
  };

  // Function to handle input changes
  const handleOrderChange = (e, field) => {
    const value = field === "quantity" || field === "price" ? Number(e.target.value) : e.target.value;
    setNewOrder(prev => ({
      ...prev,
      [field]: value,
      totalAmount: (field === "quantity" || field === "price")
        ? (field === "quantity" ? value * prev.price : prev.quantity * value)
        : prev.quantity * prev.price
    }));
  };

  // Function to delete order from the list
  const handleDeleteOrder = (index) => {
    setOrders(prevOrders => prevOrders.filter((_, i) => i !== index));
  };

  const formatVND = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  function mergeCampTypes(bookingDetail) {
    const mergedCampTypes = {};

    bookingDetail.bookingDetailResponseList.forEach(detail => {
      const campType = detail.campTypeResponse;
      if (!campType) return;

      const type = campType.type;
      const price = campType.price;

      const checkInDate = new Date(detail.checkInAt);
      const checkOutDate = new Date(detail.checkOutAt);
      const totalDays = Math.max((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24), 1);

      if (!mergedCampTypes[type]) {
        mergedCampTypes[type] = {
          ...campType,
          totalQuantity: 0,
          totalAmount: 0
        };
      }

      mergedCampTypes[type].totalQuantity += 1;
      const totalQuantity = mergedCampTypes[type].totalQuantity;
      mergedCampTypes[type].totalAmount = price * totalDays * totalQuantity;
    });
    return Object.values(mergedCampTypes);
  }

  //Table Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Call api for checkout reservations
  useEffect(() => {
    const fetchCheckoutReservations = async (user) => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            hostId: user.id
          }
        });
        setCheckoutReservations(response.data.data.content.filter(reservation => reservation.status === 'Check_In'));
      } catch (error) {
        console.error("Error fetching checkout reservations data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutReservations(user);
  }
    , []);

  //Handle api change status for Check_In status reservation to Completed status
  const handleCheckout = async (id) => {
    try {
      const formData = new FormData();
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}?status=checkout`, 
        {
          BookingDetailOrderRequest: orders
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
    );
      setCheckoutReservations(checkoutReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking out reservation:", error);
    }
  }

  //Status color
  const statusColor = (status) => {
    switch (status) {
      case 'Check_In':
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
          {checkoutReservations.length === 0 ? (
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
                  {checkoutReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((reservation, index) => (
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
                count={checkoutReservations.length}
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div ref={modalRef} className='bg-white shadow-md  w-3/5 h-4/5 relative rounded-xl'>
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-xl p-1 rounded-full"
              onClick={() => {
                setSelectedReservation(null);
                setOrders([]);
              }}
            >
              ✖
            </button>
            <div className='flex flex-col h-full overflow-hidden'>
              <div className='flex space-x-4 w-full h-5/6'>
                <div className='relative w-1/3 h-full border-r-2 border-gray-200 flex flex-col'>
                  <div className='absolute bg-black bg-opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg'>
                    {selectedReservation.campSite.name}
                  </div>
                  <img src={selectedReservation.campSite.imageList[0].path} alt='campsite' className='w-full h-auto object-cover rounded-tl-xl' />
                  <div className='overflow-y-auto px-2'>
                    <div className='p-4 border-b-2 border-gray-200'>
                      <h1 className='text-xl font-semibold mb-2'>Camp type </h1>
                      <div className='px-4'>
                        {mergeCampTypes(selectedReservation).map((campType, index) => (
                          <div key={index} className="flex items-center space-x-9">
                            <div className="flex items-center space-x-4 shadow-xl bg-gray-100 rounded-xl mt-4 relative">
                              <div className="relative">
                                <div className="absolute left-1 right-1 bg-black bg-opacity-50 text-white text-center text-xs font-bold rounded-xl p-1">
                                  {campType.type}
                                </div>
                                <img src={campType.image} alt="campType" className="w-14 h-14 object-cover rounded-lg" />
                              </div>
                            </div>
                            <div>
                              <h2 className="text-md font-bold">x{campType.totalQuantity}</h2>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedReservation.bookingSelectionResponseList.length > 0 ? (
                      <div className='mt-4 p-4 border-b-2 border-gray-200'>
                        <div>
                          <h1 className='text-xl font-semibold mb-2'>Services </h1>
                        </div>
                        <div className='px-4'>
                          {selectedReservation.bookingSelectionResponseList.map((service, index) => (
                            <div key={index} className="flex items-center space-x-9">
                              <div className='w-14'>
                                <h1 className="text-md font-bold">{service.name}</h1>
                              </div>
                              <div>
                                <h2 className="text-md font-bold">x{service.quantity}</h2>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className='p-4 border-b-2 border-gray-200'>
                        <div>
                          <h1 className='text-xl font-semibold mb-2'>Services </h1>
                        </div>
                        <div className='px-4'>
                          <h1 className='text-sm font-normal'>No services selected</h1>
                        </div>
                      </div>
                    )}
                    <div className='p-4'>
                      <h1 className='text-xl font-semibold  '>Total: {formatVND(selectedReservation.totalAmount)}</h1>
                      <h1>Deposit: {formatVND(selectedReservation.paymentResponseList[0].totalAmount)}</h1>
                    </div>
                  </div>
                </div>
                <div className='w-2/3 p-2 flex flex-col'>
                  <div className='flex pt-2 '>
                    <h1 className='text-4xl font-bold mb-4'>Booking details</h1>
                  </div>
                  <div className='overflow-y-auto pr-2'>
                    <div className=' flex items-center space-x-4'>
                      <h1 className='text-md font-semibold mb-2 text-green-500'>Check in date:  {selectedReservation.checkIn}</h1>
                      <h1 className='text-lg font-semibold mb-2'><FontAwesomeIcon icon={faChevronRight} /></h1>
                      <h1 className='text-md font-semibold mb-2 text-red-500'>Check out date: {selectedReservation.checkOut}</h1>
                    </div>
                    <div className='border-b-2 border-gray-200 mt-4 pb-4'>
                      <h1 className='text-xl font-semibold mb-2'>Guest information</h1>
                      <div className='flex items-center space-x-4 shadow-xl bg-gray-100 p-4 rounded-xl'>
                        <FontAwesomeIcon icon={faUser} className='text-6xl' />
                        <div className='w-full'>
                          <h2 className='text-md font-bold'>Name: {selectedReservation.user.lastname} {selectedReservation.user.firstname}</h2>
                          <p className='text-md'>Mail: {selectedReservation.user.email}</p>
                          <p className='text-md'>Phone number: {selectedReservation.user.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className='mt-4 pb-4'>
                      <h1 className='text-xl font-semibold mb-2'>Orders</h1>
                      <div className='mt-4 pb-4 border-b-2 border-gray-200'>
                        <div className="grid grid-cols-5 gap-2">
                          <input type="text" placeholder="Name" value={newOrder.name} onChange={(e) => handleOrderChange(e, 'name')} className="border p-2 rounded" />
                          <input type="number" placeholder="Qty" value={newOrder.quantity} onChange={(e) => handleOrderChange(e, 'quantity')} className="border p-2 rounded" />
                          <input type="number" placeholder="Price" value={newOrder.price} onChange={(e) => handleOrderChange(e, 'price')} className="border p-2 rounded" />
                          <input type="text" placeholder="Note" value={newOrder.note} onChange={(e) => handleOrderChange(e, 'note')} className="border p-2 rounded" />
                          <button onClick={handleAddOrder} className="bg-blue-500 text-white px-4 py-2 rounded">+</button>
                        </div>

                        {orders.length > 0 && (
                          <table className="mt-4 w-full border">
                            <thead>
                              <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Quantity</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Total</th>
                                <th className="border p-2">Note</th>
                                <th className="border p-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order, index) => (
                                <tr key={index}>
                                  <td className="border p-2">{order.name}</td>
                                  <td className="border p-2">{order.quantity}</td>
                                  <td className="border p-2">{formatVND(order.price)}</td>
                                  <td className="border p-2">{formatVND(order.totalAmount)}</td>
                                  <td className="border p-2">{order.note}</td>
                                  <td className="border text-center">
                                    <button
                                      onClick={() => handleDeleteOrder(index)}
                                      className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                      -
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className='h-1/6 p-4 flex justify-between border-t-2 border-gray-200 bg-white sticky bottom-0'>
                <h1 className='text-2xl font-bold mb-2'>Final price: {formatVND(calculateTotalAmount())}</h1>
                <button
                  className='bg-green-500 text-white px-4 py-2 rounded-lg'
                  onClick={() => handleCheckout(selectedReservation.id)}
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationCheckout