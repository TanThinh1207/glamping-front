import axios from "axios";

const accessToken = localStorage.getItem("accessToken");

export const fetchCampsiteById = async (campSiteId) => {
  try {
    const url = new URL(`${import.meta.env.VITE_API_GET_CAMPSITES}`);
    url.searchParams.append("id", campSiteId);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campsite: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.content;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCamptypeById = async (campSiteId, page = 0, size = 10) => {
  try {
    const url = new URL(`${import.meta.env.VITE_API_GET_CAMPTYPES}`);
    url.searchParams.append("campSiteId", campSiteId);
    url.searchParams.append("page", page);
    url.searchParams.append("size", size);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch camptype: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.data.content,
      totalPages: data.data.totalPages,
      currentPage: data.data.number,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCamptypeByIdWithDate = async ({
  campSiteId,
  checkIn,
  checkOut,
  page = 0,
  size = 10,
}) => {
  try {
    const formattedCheckIn = new Date(checkIn).toISOString().slice(0, 19);
    const formattedCheckOut = new Date(checkOut).toISOString().slice(0, 19);

    const url = new URL(`${import.meta.env.VITE_API_GET_CAMPTYPES}`);
    url.searchParams.append("campSiteId", campSiteId);
    url.searchParams.append("checkIn", formattedCheckIn);
    url.searchParams.append("checkOut", formattedCheckOut);
    url.searchParams.append("page", page);
    url.searchParams.append("size", size);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch camptype: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.data.content,
      totalPages: data.data.totalPages,
      currentPage: data.data.number,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAllCampsites = async (page = 0, size = 10) => {
  try {
    const params = new URLSearchParams({
      status: "Available",
      page: page,
      size: size,
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_GET_CAMPSITES}?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch campsites: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.data.content,
      totalPages: data.data.totalPages,
      currentPage: data.data.number,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBooking = async (bookingData) => {
  try {
    console.log(accessToken);
    const response = await axios.get(`${import.meta.env.VITE_API_BOOKING}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Booking failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchBookingByUserId = async (userId) => {
  try {
    const url = new URL(`${import.meta.env.VITE_API_BOOKING}`);
    url.searchParams.append("userId", userId);
    url.searchParams.append("direction", "desc");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.content;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCampsiteCityList = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_GET_CAMPSITES}`,
      {
        params: {
          fields: "id,city",
          sortBy: "name",
          direction: "asc",
        },
      }
    );

    return response.data.data.content;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchRatingByCampsiteId = async (
  campsiteId,
  page = 0,
  size = 100
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_RATING}/${campsiteId}`,
      {
        params: {
          sortBy: "rating",
          page: page,
          size: size,
        },
      }
    );

    return response.data.data.content;
  } catch (error) {
    throw new Error(error.message);
  }
};
