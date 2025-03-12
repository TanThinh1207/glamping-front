import React, { createContext, useContext, useState } from 'react'
import { useUser } from './UserContext';

const CampsiteContext = createContext();
export const CampsiteProvider = ({ children }) => {
  const { user } = useUser();
  const [campsiteData, setCampsiteData] = useState({
    hostId: user?.id,
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

  const [selectedUtilities, setSelectedUtilities] = useState([]);
  const updateSelectedUtilities = (utility) => {
    setSelectedUtilities((prev) => {
      const exists = prev.some((item) => item.id === utility.id);
      const updatedList = exists
        ? prev.filter((item) => item.id !== utility.id)
        : [...prev, utility];

      updateCampsiteData("utilityIds", updatedList.map((item) => item.id));

      return updatedList;
    });
  }

  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState([]);
  const updateSelectedPlaceTypes = (placeType) => {
    setSelectedPlaceTypes((prev) => {
      const exists = prev.some((item) => item.id === placeType.id);
      const updatedList = exists
        ? prev.filter((item) => item.id !== placeType.id)
        : [...prev, placeType];

      updateCampsiteData("placeTypeIds", updatedList.map((item) => item.id));

      return updatedList;
    });
  }

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
    setSelectedUtilities([]);
    setSelectedPlaceTypes([]);
  };

  return (
    <CampsiteContext.Provider value={{
      campsiteData, updateCampsiteData,
      campsiteImages, updateCampsiteImages,
      serviceImages, updateServiceImages,
      campTypeImages, updateCampTypeImages,
      selectedUtilities, updateSelectedUtilities,
      selectedPlaceTypes, updateSelectedPlaceTypes,
      resetCampsiteData,
    }}>
      {children}
    </CampsiteContext.Provider>
  );
}

export const useCampsite = () => useContext(CampsiteContext);