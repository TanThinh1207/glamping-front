import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hosting = () => {
  const [activeTab, setActiveTab] = useState("Check_In");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [reservationsByStatus, setReservationsByStatus] = useState({});
  const navigate = useNavigate();
  const [restrictedAcount, setRestrictedAccount] = useState(user.restricted);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        console.log('user', user);
        const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`  
           },
          params: { hostId: user.id, size: 50 }
        });
        setAllReservations(response.data.data.content);
      } catch (error) {
        console.error("Error fetching reservations data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user]);

  const getReservationPath = (status) => {
    const paths = {
      Check_In: "/hosting/reservations/checking-out",
      Refund: "/hosting/reservations/canceled",
      Completed: "/hosting/reservations/completed",
      Accepted: "/hosting/reservations/checking-in",
      Deposit: "/hosting/reservations/upcoming",
    };
    return paths[status] || "/hosting/reservations";
  };

  useEffect(() => {
    const groupedReservations = allReservations.reduce((acc, reservation) => {
      const status = reservation.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(reservation);
      return acc;
    }, {});
    setReservationsByStatus(groupedReservations);
  }, [allReservations]);

  const handleConnectPayment = async () => {
    try {
      const respone = await axios.get(`${import.meta.env.VITE_API_PAYMENT_CONNECT}`, {
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        params: { hostId: user.id }
      });
      console.log('response', respone.data.redirectUrl);
      window.location.href = respone.data.redirectUrl;

    } catch (error) {
      console.error('Error navigating to payment page:', error);
    }
  }
  
  return (
    <div className="w-full h-screen bg-white">
      <div className="mx-auto px-30 max-w-7xl text-left">
        <h1 className="text-5xl font-semibold py-8">Welcome back, {user.firstname}</h1>
      </div>
      {restrictedAcount && (
        <div className="mx-auto px-30 max-w-7xl text-left">
          <h1 className="text-4xl py-8">Announcements</h1>
            <div className="border border-red-500 bg-red-100 rounded-lg p-4 w-1/3">
              <h1 className="text-2xl font-semibold">Your account is restricted</h1>
              <p className="text-lg">Please add your payment's method.</p>
              <div className="mt-6 text-right">
              <button
                className="text-purple-900 underline hover:text-black-900 focus:outline-none"
                onClick={handleConnectPayment}
              >
                Connect payment
              </button>
              </div>
          </div>
        </div>
      )}
      <div className="mx-auto px-30 max-w-7xl text-left">
        <h1 className="text-4xl py-8">Your reservations</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-6 items-start justify-start">
              <ul className="flex flex-row gap-6">
                {Object.keys(reservationsByStatus).map((status) => (
                  <li key={status}>
                    <button
                      className={`rounded-full border border-black py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg ${activeTab === status
                        ? "text-white bg-slate-800 border-slate-800"
                        : "text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"}`}
                      type="button"
                      onClick={() => setActiveTab(status)}
                    >
                      {status} ({reservationsByStatus[status].length})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className='mt-4'>
              {activeTab && reservationsByStatus[activeTab]?.length === 0 && (
                <div className='bg-slate-100 rounded-lg w-auto h-60 my-4 text-center flex items-center justify-center align-middle'>
                  <p>No reservations found for {activeTab}.</p>
                </div>
              )}
              <div className="mx-4">
                <Swiper modules={[Navigation]} spaceBetween={30} slidesPerView={4} navigation>
                  {reservationsByStatus[activeTab]?.map((info) => (
                    <SwiperSlide key={info.id}>
                      <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-xl p-5">
                        <div className="px-5">
                          <h6 className="mb-2 text-lg font-semibold">{info.campSite.name}</h6>

                          <p className="text-green-500 leading-normal font-light">
                            Check-in: {info.checkIn}
                          </p>
                          <p className="text-red-500 leading-normal font-light">
                            Check-out: {info.checkOut}
                          </p>
                          <div className="mt-6 text-right">
                            <button
                              className="text-purple-900 underline hover:text-black-900 focus:outline-none"
                              onClick={() => navigate(getReservationPath(info.status))}
                            >
                              View reservation
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hosting;
