import React, { useState, useEffect } from "react";
import { useBooking } from "../context/BookingContext";
import { fetchCampsiteById, fetchCamptypeById, createBooking } from "../service/BookingService";
import dayjs from "dayjs";
import { toast } from "sonner";

const BookingSummary = ({ selectedServices = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { booking, resetBooking } = useBooking();
  const { updateTotalAmount } = useBooking();

  const checkInDateStr = localStorage.getItem("checkInDate");
  const checkOutDateStr = localStorage.getItem("checkOutDate");

  const checkInDate = checkInDateStr ? dayjs(checkInDateStr) : null;
  const checkOutDate = checkOutDateStr ? dayjs(checkOutDateStr) : null;

  const campsiteId = booking.campSiteId;
  const [campsite, setCampsite] = useState({});
  const [camptypes, setCamptypes] = useState([]);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [capacityLimit, setCapacityLimit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const handleConfirmBooking = async () => {
    if (!booking.userId) {
      toast.error("Please log in before booking.");
      return;
    }
    if (!booking.campSiteId || booking.bookingDetails.length === 0) {
      toast.error("Please select a campsite and at least one accommodation.");
      return;
    }
    try {
      setLoading(true);
      console.log("Booking:", booking);
      const responseData = await createBooking(booking);
      const bookingId = responseData.data.id;
      const bookingName = responseData.data.campSite.name;
      const depositRate = parseFloat(responseData.data.campSite.depositRate || 1);
      const totalDeposit = depositRate * totalPrice;

      console.log("Booking Response:", responseData);

      // Send the full total price to payment, not just the deposit
      const paymentResponse = await fetch(`${import.meta.env.VITE_API_PAYMENT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: totalDeposit,
          name: bookingName,
          currency: "vnd",
        }),
      });
      const paymentData = await paymentResponse.json();
      console.log("Payment Response:", paymentData);

      if (paymentResponse.ok) {
        window.open(paymentData.sessionUrl, '_blank');
      } else {
        throw new Error(paymentData.message || "Payment session creation failed.");
      }
      localStorage.removeItem("booking");
      localStorage.removeItem("checkInDate");
      localStorage.removeItem("checkOutDate");
      localStorage.removeItem("guests");
      resetBooking();

    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      if (checkInDate && checkOutDate) {
        const calculatedNights = Math.max(0, checkOutDate.diff(checkInDate, "day"));
        setNights(calculatedNights);
      }
    } catch (error) {
      console.error("Error calculating nights:", error);
      setError("Error calculating the number of nights.");
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const getDataDetails = async () => {
      try {
        setLoading(true);
        const campsiteData = await fetchCampsiteById(campsiteId);
        const camptypesData = await fetchCamptypeById(campsiteId, 0, 100);
        if (!campsiteData || campsiteData.length === 0) {
          throw new Error("Campsite data not found.");
        }

        setCampsite(campsiteData[0] || {});
        setCamptypes(camptypesData.content || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (campsiteId) {
      getDataDetails();
    }
  }, [campsiteId]);

  // Calculate total capacity limit for extra services
  useEffect(() => {
    if (booking?.bookingDetails?.length > 0 && camptypes.length > 0) {
      let totalCapacity = 0;
      booking.bookingDetails.forEach((item) => {
        const campType = camptypes.find((type) => type.id === item.campTypeId);
        if (campType) {
          totalCapacity += campType.capacity * item.quantity;
        }
      });
      setCapacityLimit(totalCapacity);
    }
  }, [booking, camptypes]);

  // Calculate total price including weekend rates
  useEffect(() => {
    try {
      let total = 0;

      if (booking?.bookingDetails?.length > 0 && camptypes.length > 0 && checkInDate && checkOutDate) {
        booking.bookingDetails.forEach((item) => {
          const campType = camptypes.find((type) => type.id === item.campTypeId);
          if (campType) {
            // Calculate price day by day considering weekend rates
            let subtotal = 0;
            let currentDate = checkInDate.clone();

            while (currentDate.isBefore(checkOutDate)) {
              // Check if the current day is a weekend (Friday, Saturday, or Sunday)
              const isWeekend = currentDate.day() === 5 || currentDate.day() === 6 || currentDate.day() === 0;
              subtotal += isWeekend ? campType.weekendRate : campType.price;
              currentDate = currentDate.add(1, 'day');
            }

            total += subtotal * item.quantity;
          }
        });
      }

      // Add extra services
      selectedServices.forEach((service) => {
        total += parseFloat(service.price) * parseFloat(service.quantity);
      });

      setTotalPrice(total);
      updateTotalAmount(total);
    } catch (error) {
      console.error("Error calculating total price:", error);
      setError("Error calculating total price.");
    }
  }, [booking, camptypes, checkInDate, checkOutDate, selectedServices, updateTotalAmount]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full bg-[#F5F3EB] p-6 shadow-md text-[#3C2F2F] font-canto">
      <h2 className="text-2xl font-semibold mb-4">{campsite.name}</h2>

      <div className="mb-3 text-xl">
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
          <h3 className="text-xl font-semibold">Selected Accommodations</h3>
          {booking.bookingDetails.map((item, index) => {
            const campType = camptypes.find((type) => type.id === item.campTypeId);

            // Calculate camptype price with weekend rates
            let camptypeTotal = 0;
            if (campType && checkInDate && checkOutDate) {
              let currentDate = checkInDate.clone();
              while (currentDate.isBefore(checkOutDate)) {
                const isWeekend = currentDate.day() === 5 || currentDate.day() === 6 || currentDate.day() === 0;
                camptypeTotal += isWeekend ? campType.weekendRate : campType.price;
                currentDate = currentDate.add(1, 'day');
              }
              camptypeTotal *= item.quantity;
            }

            return (
              <div key={index} className="mt-2 text-xl">
                <p>
                  <span className="font-semibold">Camp {index + 1}:</span>{" "}
                  {campType ? campType.type : "Unknown Camp Type"}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span> {item.quantity}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> VND {camptypeTotal.toLocaleString("vi-VN")}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No accommodations selected.</p>
      )}

      <div className="mb-3">
        <p className="text-xl font-semibold">Extra Services</p>
        <p className="text-lg text-gray-600">Maximum capacity: {capacityLimit} people</p>
        <div className="text-xl">
          {selectedServices.length > 0 ? selectedServices.map(service => (
            <div key={service.id} className="flex justify-between">
              <p>{service.name} x{service.quantity}</p>
              <p>VND {(service.price * service.quantity).toLocaleString("vi-VN")}</p>
            </div>
          )) : <p>No extra services selected.</p>}
        </div>
      </div>

      <div className="border-t border-gray-300 pt-3">
        <p className="text-lg text-gray-600">Total {nights} nights (taxes incl.):</p>
        <p className="text-xl font-bold mt-1">VND {totalPrice.toLocaleString("vi-VN")}</p>
      </div>

      <div className="pt-3">
        <p className="text-lg">
          Required deposit: VND {(parseFloat(campsite.depositRate || 1) * parseFloat(totalPrice)).toLocaleString("vi-VN")}
        </p>
      </div>

      <button className="bg-black w-full text-white text-lg border-black border uppercase my-5 p-4 transform duration-300 ease-in-out hover:text-black hover:bg-transparent hover:border hover:border-black mr-2"
        onClick={handleConfirmBooking}
      >
        CONFIRM BOOKING
      </button>
    </div>
  );
};

export default BookingSummary;