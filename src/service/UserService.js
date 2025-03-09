export const updateUserData = async (id, userData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_USER_ID}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error(`Failed to update user data: ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log(responseData);

        return responseData;
    } catch (error) {
        throw new Error(error.message);
    }
}