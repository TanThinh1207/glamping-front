import React, { useState, useEffect } from "react";
import { useBooking } from "../context/BookingContext";
import { fetchCampsiteById, fetchCamptypeById } from "../utils/FetchBookingData";
import dayjs from "dayjs";

const BookingSummary = ({ selectedServices = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { booking } = useBooking();
  const { updateTotalAmount } = useBooking();

  const checkInDateStr = localStorage.getItem("checkInDate");
  const checkOutDateStr = localStorage.getItem("checkOutDate");

  const checkInDate = checkInDateStr ? dayjs(checkInDateStr) : null;
  const checkOutDate = checkOutDateStr ? dayjs(checkOutDateStr) : null;

  const campsiteId = booking.campSiteId;
  const [campsite, setCampsite] = useState("");
  const [camptypes, setCamptypes] = useState([]);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.max(0, checkOutDate.diff(checkInDate, "day"));
      setNights(nights);
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const getDataDetails = async () => {
      try {
        setLoading(true);
        const campsiteData = await fetchCampsiteById(campsiteId);
        const camptypesData = await fetchCamptypeById(campsiteId);
        setCampsite(campsiteData);
        setCamptypes(camptypesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getDataDetails();
  }, [campsiteId]);

  useEffect(() => {
    let total = 0;
    if (booking?.bookingDetails?.length > 0 && camptypes.length > 0) {
      booking.bookingDetails.forEach((item) => {
        const campType = camptypes.find((type) => type.id === item.campTypeId);
        if (campType) {
          total += campType.price * item.quantity * nights;
          }
        });
    }

    selectedServices.forEach(service => {
      total += service.price * service.quantity;
    });

    if (total !== totalPrice) {
      setTotalPrice(total);
      updateTotalAmount(total);
    }
    
  }, [booking, camptypes, nights, selectedServices]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F3EB] p-6 shadow-md text-[#3C2F2F] font-sans">
      <h2 className="text-xl font-semibold mb-4">{campsite.name}</h2>

      <div className="mb-3">
        <p>
          <span className="font-semibold">Arrival:</span> {checkInDate?.format("MMMM DD YYYY")}
        </p>
        <p>
          <span className="font-semibold">Departure:</span> {checkOutDate?.format("MMMM DD YYYY")}
        </p>
        <p>
          <span className="font-semibold">Number of nights:</span> {nights}
        </p>
      </div>

      {booking?.bookingDetails?.length > 0 ? (
        <div className="mb-3">
          <h3 className="text-lg font-semibold">Selected Accommodations</h3>
          {booking.bookingDetails.map((item, index) => {
            const campType = camptypes.find((type) => type.id === item.campTypeId);
            return (
              <div key={index} className="mt-2">
                <p>
                  <span className="font-semibold">Camp {index + 1}:</span>{" "}
                  {campType ? campType.type : "Unknown Camp Type"}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span> {item.quantity}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No accommodations selected.</p>
      )}
      <p className="text-lg font-semibold">Extra Services</p>
      {selectedServices.length > 0 ? selectedServices.map(service => (
        <p key={service.id}>{service.name} x{service.quantity}</p>
      )) : <p>No extra services selected.</p>}

      <div className="border-t border-gray-300 pt-3">
        <p className="text-sm text-gray-600">Total {nights} nights (taxes incl.):</p>
        <p className="text-xl font-bold mt-1">VND {totalPrice.toLocaleString()}</p>
      </div>

      <button className="bg-black w-full text-white text-xs border-black border uppercase my-5 p-4 transform duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black mr-2">
        CONFIRM BOOKING
      </button>
    </div>
  );
};

export default BookingSummary;
