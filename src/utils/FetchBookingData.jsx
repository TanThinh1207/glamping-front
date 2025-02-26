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

export const fetchAllCampsites = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_GET_CAMPSITES}`);
        if (!response.ok) throw new Error(`Failed to fetch campsite: ${response.statusText}`);
        
        const data = await response.json();
        return data.data.content;
    } catch (error) {
        throw new Error(error.message);
    }
};