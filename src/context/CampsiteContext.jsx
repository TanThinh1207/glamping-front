import React, { createContext, useContext, useState } from 'react'

const CampsiteContext = createContext();
export const CampsiteProvider = ({ children }) => {
    const [campsiteData, setCampsiteData] = useState({
            hostId: 1,
            name: "", 
            address: "",
            latitude: 0,
            longitude: 0,
            city: "",
            description: "",
            placeTypeIds: [], 
            campSiteSelections: [],
            utilityIds: [], 
            campTypeList: [],
          }
    );
    const updateCampsiteData = (key, value) => {
        setCampsiteData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const [campsiteImages, setCampsiteImages] = useState([]);
    const updateCampsiteImages = (images) => {
        setCampsiteImages(images);
    };
    return (
        <CampsiteContext.Provider value={{ campsiteData, updateCampsiteData, campsiteImages, updateCampsiteImages }}>
          {children}
        </CampsiteContext.Provider>
      );
    };
    
    export const useCampsite = () => useContext(CampsiteContext);