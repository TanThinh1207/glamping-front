import React from 'react'
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TablePagination } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const ReservationCheckout = () => {
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const modalRef = useRef();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checkoutReservations, setCheckoutReservations] = useState([]);
  const { user } = useUser();
  const [selectedCampName, setSelectedCampName] = useState("");
  const [bookingDetailId, setBookingDetailId] = useState('');
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(
    {
      bookingDetailId: '',
      name: '',
      quantity: '',
      price: '',
      totalAmount: '',
      note: ''
    }
  );

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    if (!selectedReservation) {
      console.log("selectedReservation is null");
      return 0;
    }

    const totalOrderAmount = formatBookingData(orders).reduce((sum, order) => sum + order.totalAmount, 0);
    console.log("Total Amount:", selectedReservation.totalAmount, "Deposit:", selectedReservation.depositAmount, "Orders Total:", totalOrderAmount);

    return (selectedReservation.totalAmount - selectedReservation.paymentResponseList[0].totalAmount) + totalOrderAmount;
  };
  useEffect(() => {
    calculateTotalAmount();
  }, [orders, selectedReservation]);

  // Function to add new order to the list
  const handleAddOrder = () => {
    if (newOrder.name.trim() === '') return;

    setOrders((prevOrders) => ({
      ...prevOrders,
      [bookingDetailId]: [
        ...(prevOrders[bookingDetailId] || []),
        { 
          ...newOrder,
          bookingDetailId: bookingDetailId
        },
      ]
    }));

    setNewOrder({
      bookingDetailId: bookingDetailId,
      name: '', 
      quantity: '', 
      price: '', 
      totalAmount: '', 
      note: '' 
    });
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
    setOrders(prevOrders => ({
      ...prevOrders,
      [bookingDetailId]: prevOrders[bookingDetailId].filter((_, i) => i !== index)
    }));
  };

  const formatVND = (price) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  //Table Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function formatBookingData(data) {
    return Object.values(data).flat();
}

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
            hostId: user.id,
            status: 'Check_In',
          }
        });
        setCheckoutReservations(response.data.data.content);
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
      const orderList = formatBookingData(orders);
      console.log(orderList);
      await axios.put(`${import.meta.env.VITE_API_BOOKING}/${id}?status=checkout`,
          orderList ,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      handleCloseModal();
      setCheckoutReservations(checkoutReservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error("Error checking out reservation:", error);
    }
  }

  const handleCloseModal = () => {
    setSelectedReservation(null);
    setOrders([]);
    setBookingDetailId('');
    setSelectedCampName('');
  };
  //Status color
  const statusColor = (status) => {
    switch (status) {
      case 'Check_In':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleCampTypeClick = (id, name) => {
    setBookingDetailId(id);
    setSelectedCampName(name);
    console.log(bookingDetailId);
    setOrders((prevOrders) => ({
      ...prevOrders,
      [id]: prevOrders[id] || [],
    }));
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
                handleCloseModal();
                console.log(selectedReservation);
              }}
            >
              ✖
            </button>
            <div className='flex flex-col h-full overflow-hidden'>
              <div className='flex-grow min-h-0 flex'>
                <div className='relative w-1/3 h-full border-r-2 border-gray-200 flex flex-col'>
                  <div className='absolute bg-black bg-opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg'>
                    {selectedReservation.campSite.name}
                  </div>
                  <img src={selectedReservation.campSite.imageList[0].path} alt='campsite' className='w-full h-auto object-cover rounded-tl-xl' />
                  <div className='overflow-y-auto px-2'>
                    <div className='p-4 border-b-2 border-gray-200'>
                      <h1 className='text-xl font-semibold mb-2'>Camp type </h1>
                      <div className='px-4'>
                        <Swiper
                          modules={[Navigation]}
                          spaceBetween={30}
                          slidesPerView={4}
                          navigation
                          preventClicks={true}
                          preventClicksPropagation={false}
                          simulateTouch={true}
                        >
                          {selectedReservation.bookingDetailResponseList.map((campType, index) => (
                            <SwiperSlide
                              key={index}
                              onClick={() => handleCampTypeClick(campType.bookingDetailId, campType.campResponse.campName)}
                            >
                              <div className="flex items-center space-x-4 shadow-xl bg-gray-100 rounded-xl mt-4 relative">
                                <div className="relative">
                                  <div className="absolute left-1 right-1 bg-black bg-opacity-50 text-white text-center text-xs font-bold rounded-xl p-1">
                                    {campType.campResponse.campName}
                                  </div>
                                  <img
                                    src={campType.campTypeResponse.image}
                                    alt="campType"
                                    className="w-14 h-14 object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
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
                      <h1 className='text-xl font-semibold mb-2'>Orders - {selectedCampName || "Select a camp"}</h1>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newOrder.name}
                          onChange={(e) => handleOrderChange(e, 'name')}
                          className={`border p-2 rounded ${!bookingDetailId ? "bg-gray-200 cursor-not-allowed" : ""}`}
                          disabled={!bookingDetailId}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={newOrder.quantity}
                          onChange={(e) => handleOrderChange(e, 'quantity')}
                          className={`border p-2 rounded ${!bookingDetailId ? "bg-gray-200 cursor-not-allowed" : ""}`}
                          disabled={!bookingDetailId}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={newOrder.price}
                          onChange={(e) => handleOrderChange(e, 'price')}
                          className={`border p-2 rounded ${!bookingDetailId ? "bg-gray-200 cursor-not-allowed" : ""}`}
                          disabled={!bookingDetailId}
                        />
                        <input
                          type="text"
                          placeholder="Note"
                          value={newOrder.note}
                          onChange={(e) => handleOrderChange(e, 'note')}
                          className={`border p-2 rounded ${!bookingDetailId ? "bg-gray-200 cursor-not-allowed" : ""}`}
                          disabled={!bookingDetailId}
                        />
                        <button
                          onClick={handleAddOrder}
                          disabled={!bookingDetailId}
                          className={`px-4 py-2 bg-blue-500 text-white rounded ${!bookingDetailId ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
                        >
                          +
                        </button>
                      </div>
                      {bookingDetailId && (
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-300">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border text-center">Quantity</th>
                                <th className="py-2 px-4 border text-center">Price</th>
                                <th className="py-2 px-4 border text-center">Total</th>
                                <th className="py-2 px-4 border text-left">Notes</th>
                                <th className="py-2 px-4 border text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(orders[bookingDetailId] || []).map((order, index) => (
                                <tr key={index} className="border">
                                  <td className="py-2 px-4 border">{order.name}</td>
                                  <td className="py-2 px-4 border text-center">{order.quantity}</td>
                                  <td className="py-2 px-4 border text-center">{formatVND(order.price)}</td>
                                  <td className="py-2 px-4 border text-center">{formatVND(order.totalAmount)}</td>
                                  <td className="py-2 px-4 border">{order.note}</td>
                                  <td className="py-2 px-4 border text-center">
                                    <button onClick={() => handleDeleteOrder(index)} className="bg-red-500 text-white px-3 py-1 rounded">❌</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='h-20 p-4 flex justify-between border-t-2 border-gray-200 bg-white sticky bottom-0'>
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