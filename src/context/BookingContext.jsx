import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useUser } from './UserContext';

const BookingContext = createContext();


export const BookingProvider = ({ children }) => {
    const { user } = useUser();

    const [booking, setBooking] = useState(() => {
        const savedBooking = localStorage.getItem('booking');
        if (savedBooking) {
            const parsed = JSON.parse(savedBooking);
            if (parsed.userId === user?.id) {
                return parsed;
            }
        }
        return {
            bookingDetails: [],
            userId: user?.id || null,
            campSiteId: null,
            totalAmount: 0,
            bookingSelectionRequestList: [],
        };
    });

    const resetBooking = useCallback(() => {
        setBooking({
            bookingDetails: [],
            userId: user?.id || null,
            campSiteId: null,
            totalAmount: 0,
            bookingSelectionRequestList: [],
        });
    }, [user?.id]);

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
        setBooking((prev) => {
            if (prev.campSiteId && prev.campSiteId !== campSiteId) {
                return {
                    bookingDetails: [],
                    userId: user?.id || null,
                    campSiteId,
                    totalAmount: 0,
                    bookingSelectionRequestList: [],
                };
            }
            return { ...prev, campSiteId };
        });
    }, [user?.id]);

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

    const updateDatesBookingSummary = (checkIn, checkOut) => {
        setBooking((prev) => ({
            ...prev,
            checkInTime: checkIn,
            checkOutTime: checkOut
        }));
    };
    

    useEffect(() => {
        // only save booking if user is logged in
        if (user?.id) {
            localStorage.setItem("booking", JSON.stringify(booking));
        }
    }, [booking, user?.id]);

    return (
        <BookingContext.Provider value={{
            booking,
            resetBooking,
            updateDatesBookingSummary,
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
