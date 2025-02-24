import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [booking, setBooking] = useState(() => {
        const savedBooking = localStorage.getItem('booking');
        return savedBooking ? JSON.parse(savedBooking) : {
            bookingDetails: [],
            userId: null,
            campSiteId: null,
            totalAmount: 0,
            bookingSelectionRequestList: [],
        };
    });

    const updateTotalAmount = useCallback((total) => {
        setBooking((prev) => ({ ...prev, totalAmount: total }));
    }, []);

    const updateServices = useCallback((services) => {
        const serviceList = Object.entries(services)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({
                idSelection: parseInt(id),
                quantity
            }));

        setBooking((prev) => {
            const updatedBooking = { ...prev, bookingSelectionRequestList: serviceList };
            localStorage.setItem("booking", JSON.stringify(updatedBooking));
            return updatedBooking;
        });
    }, []);

    const updateCampsite = useCallback((campSiteId) => {
        setBooking((prev) => ({ ...prev, campSiteId }));
    }, []);

    const updateCamptype = useCallback((campTypeId, quantity) => {
        setBooking((prev) => {
            const existingIndex = prev.bookingDetails.findIndex(item => item.campTypeId === campTypeId);
            const updatedDetails = [...prev.bookingDetails];

            if (existingIndex !== -1) {
                updatedDetails[existingIndex] = {
                    ...updatedDetails[existingIndex],
                    quantity
                };
            } else {
                updatedDetails.push({
                    campTypeId,
                    quantity,
                    checkInAt: localStorage.getItem('checkInDate') || '',
                    checkOutAt: localStorage.getItem('checkOutDate') || ''
                });
            }

            return { ...prev, bookingDetails: updatedDetails };
        });
    }, []);

    const updateDates = useCallback((index, checkInAt, checkOutAt) => {
        setBooking((prev) => {
            const updatedDetails = [...prev.bookingDetails];

            if (index >= updatedDetails.length) {
                updatedDetails.push({
                    campTypeId: null,
                    quantity: 0,
                    checkInAt,
                    checkOutAt
                });
            } else {
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    checkInAt,
                    checkOutAt
                };
            }

            return { ...prev, bookingDetails: updatedDetails };
        });
    }, []);

    useEffect(() => {
        localStorage.setItem("booking", JSON.stringify(booking));
    }, [booking]);

    return (
        <BookingContext.Provider value={{
            booking,
            updateTotalAmount,
            updateServices,
            updateCampsite,
            updateCamptype,
            updateDates
        }}>
            {children}
        </BookingContext.Provider>
    )
}

export const useBooking = () => useContext(BookingContext);
