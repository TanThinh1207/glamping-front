import React, { createContext, useContext, useState } from 'react'
import { useUser } from './UserContext';

const CampsiteContext = createContext();
export const CampsiteProvider = ({ children }) => {
  const { user } = useUser();
  const [campsiteData, setCampsiteData] = useState({
    hostId: user.id,
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

  const [serviceImages, setServiceImages] = useState([]);
  const updateServiceImages = (images) => {
    setServiceImages((prevImages) => [...prevImages, images]);
  }

  const [campTypeImages, setCampTypeImages] = useState([]);
  const updateCampTypeImages = (images) => {
    setCampTypeImages((prevImages) => [...prevImages, images]);
  };

  const resetCampsiteData = () => {
    setCampsiteData({
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
    });
    setCampsiteImages([]);
    setServiceImages([]);
    setCampTypeImages([]);
  };

  return (
    <CampsiteContext.Provider value={{
      campsiteData, updateCampsiteData,
      campsiteImages, updateCampsiteImages,
      serviceImages, updateServiceImages,
      campTypeImages, updateCampTypeImages,
      resetCampsiteData,
    }}>
      {children}
    </CampsiteContext.Provider>
  );
}

export const useCampsite = () => useContext(CampsiteContext);