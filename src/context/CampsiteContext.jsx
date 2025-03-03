import React, { createContext, useContext, useState } from 'react'

const CampsiteContext = createContext();
export const CampsiteProvider = ({ children }) => {
    const [campsiteData, setCampsiteData] = useState({
        campsiteName: '',
        campsiteDescription: '',
        campsitePhoto: [],
        campsiteType: [],
        campsiteUtilities: [],
        campsiteServices: [],
        campsiteLocation: {
            lat: 0,
            lng: 0,
            address: '',
            city: '',
            country: '',
        },
        campType: [],
    });
    const updateCampsiteData = (key, value) => {
        setCampsiteData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };
    return (
        <CampsiteContext.Provider value={{ campsiteData, updateCampsiteData }}>
          {children}
        </CampsiteContext.Provider>
      );
    };
    
    export const useCampsite = () => useContext(CampsiteContext);