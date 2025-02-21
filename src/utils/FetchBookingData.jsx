export const fetchCampsiteById = async (campSiteId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_GET_CAMPSITE_BY_ID}${campSiteId}`);
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchCamptypeById = async (campSiteId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_GET_CAMPTYPES_BY_CAMPSITEID}${campSiteId}`);
        if (!response.ok) throw new Error(`Failed to fetch camptypes: ${response.statusText}`);

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchAllCampsites = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_GET_CAMPSITES}`);
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
};