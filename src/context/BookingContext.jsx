import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [booking, setBooking] = useState({
        bookingDetails: [
            { campTypeId: null, quantity: 0, checkInAt: '', checkOutAt: '' }
        ],
        userId: null,
        campSiteId: null,
        totalAmount: 0,
        bookingSelectionRequestList: [],
    });

    const updateTotalAmount = (total) => {
        setBooking((prev) => ({ ...prev, totalAmount: total }));
    };

    const updateServices = (services) => {
        const serviceList = Object.entries(services)
            .filter(([_, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({
                idSelection: parseInt(id),
                quantity
            }));
    
        setBooking((prev) => ({ ...prev, bookingSelectionRequestList: serviceList }));
    };

    const updateCampsite = (campSiteId) => {
        setBooking(prev => ({ ...prev, campSiteId }));
    }

    const updateCamptype = (index, campTypeId, quantity) => {
        setBooking(prev => {
            const updatedDetails = [...prev.bookingDetails];

            if (index >= updatedDetails.length) {
                updatedDetails[index] = {
                    campTypeId,
                    quantity,
                    checkInAt: '',
                    checkOutAt: ''
                }
            } else {
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    campTypeId,
                    quantity
                }
            }

            return { ...prev, bookingDetails: updatedDetails };
        });
    }

    const updateDates = (index, checkInAt, checkOutAt) => {
        setBooking(prev => {
            const updatedDetails = [...prev.bookingDetails];

            if (index >= updatedDetails.length) {
                updatedDetails[index] = {
                    campTypeId: null,
                    quantity: 0,
                    checkInAt,
                    checkOutAt
                }
            } else {
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    checkInAt,
                    checkOutAt
                }
            }

            return { ...prev, bookingDetails: updatedDetails };
        });
    }

    return (
        <BookingContext.Provider value={{ booking, updateTotalAmount, updateServices, updateCampsite, updateCamptype, updateDates }}>
            {children}
        </BookingContext.Provider>
    )
}

export const useBooking = () => useContext(BookingContext);
