import axios from "axios";

export const updateUserData = async (id, userData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_USER_ID}${id}`, userData);
        if (!response.statusCode === 200) {
            throw new Error(`Failed to update user data: ${response.statusText}`);
        }
        console.log(response.data);

        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchUserData = async (id) => {
    try {
        const response = await axios.get(import.meta.env.VITE_API_GET_USERS, {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                id: id,
            }
        });
        return response.data.data.content[0];
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};