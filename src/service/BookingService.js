export const fetchCampsiteById = async (campSiteId) => {
    try {
        const url = new URL(`${import.meta.env.VITE_API_GET_CAMPSITES}`);
        url.searchParams.append('id', campSiteId);
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);

        const data = await response.json();
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchCamptypeById = async (campSiteId) => {
    try {
        const url = new URL(`${import.meta.env.VITE_API_GET_CAMPTYPES}`);
        url.searchParams.append('campSiteId', campSiteId);
        const response = await fetch(url.toString());
        
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);
        const data = await response.json();
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchCamptypeByIdWithDate = async ({ campSiteId, checkIn, checkOut }) => {
    try {
        const formattedCheckIn = new Date(checkIn).toISOString().slice(0, 19);
        const formattedCheckOut = new Date(checkOut).toISOString().slice(0, 19);

        const url = new URL(`${import.meta.env.VITE_API_GET_CAMPTYPES}`);
        url.searchParams.append('campSiteId', campSiteId);
        url.searchParams.append('checkIn', formattedCheckIn);
        url.searchParams.append('checkOut', formattedCheckOut);

        const response = await fetch(url.toString());

        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);

        const data = await response.json();
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const fetchAllCampsites = async () => {
    try {
        const formData = new FormData();
        formData.append('status', 'Available');
        const response = await fetch(`${import.meta.env.VITE_API_GET_CAMPSITES}`, formData, {
            method: 'GET',
            headers: {
                'Content-Type':  'multipart/form-data'
            },
        });
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);

        const data = await response.json();
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BOOKING}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        if (!response.ok) {
            throw new Error(`Booking failed: ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log(bookingData);
        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchBookingByUserId = async (userId) => {
    try {
        const url = new URL(`${import.meta.env.VITE_API_BOOKING}`);
        url.searchParams.append('userId', userId);
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error(`Failed to fetch booking: ${response.statusText}`);

        const data = await response.json();
        console.log(data)
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
}