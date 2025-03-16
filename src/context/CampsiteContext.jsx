import React, { createContext, useContext, useState } from 'react'
import { useUser } from './UserContext';

const CampsiteContext = createContext();
export const CampsiteProvider = ({ children }) => {

  // Campsite data
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

  // Campsite images
  const [campsiteImages, setCampsiteImages] = useState([]);
  const updateCampsiteImages = (images) => {
    setCampsiteImages(images);
  };

  // Service images
  const [serviceImages, setServiceImages] = useState([]);
  const updateServiceImages = (images) => {
    setServiceImages((prevImages) => [...prevImages, images]);
  }

  // Camp type images
  const [campTypeImages, setCampTypeImages] = useState([]);
  const updateCampTypeImages = (images) => {
    setCampTypeImages((prevImages) => [...prevImages, images]);
  };

  // Utilities selection
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

  // Place type selection
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


  // Camp type context
 const [campTypes, setCampTypes] = useState([]);
  const addCampType = (campType) => {
    setCampTypes((prev) => {
      const updatedCampTypes = [...prev, campType];
      updateCampsiteData(
        "campTypeList",
        updatedCampTypes.map(({ facilities, image, ...rest }) => ({
          ...rest,
          facilities: facilities.map((f) => f.id),
        }))
      );
      return updatedCampTypes;
    });
    updateCampTypeImages(campType.image);
  };

  const updateCampType = (index, updatedCampType) => {
    setCampTypes((prev) => {
      const newCampTypes = [...prev];
      newCampTypes[index] = updatedCampType;
      updateCampsiteData(
        "campTypeList",
        newCampTypes.map(({ facilities, image, ...rest }) => ({
          ...rest,
          facilities: facilities.map((f) => f.id),
        }))
      );
      return newCampTypes;
    });
  };

  const removeCampType = (index) => {
    setCampTypes((prev) => {
      const newCampTypes = prev.filter((_, i) => i !== index);
      updateCampsiteData(
        "campTypeList",
        newCampTypes.map(({ facilities, image, ...rest }) => ({
          ...rest,
          facilities: facilities.map((f) => f.id),
        }))
      );
      setCampTypeImages((prevImages) => prevImages.filter((_, i) => i !== index));
      return newCampTypes;
    });
  };
  
  // Service context
  const [services, setServices] = useState([]);
  const addService = (service) => {
    setServices((prevServices) => [...prevServices, service]);
    updateCampsiteData(
      'campSiteSelections',
      [...services, service].map(({ image, ...rest }) => rest)
    );
    updateServiceImages(service.image);
  };

  const updateService = (index, updatedService) => {
    setServices((prevServices) => {
      const newServices = [...prevServices];
      newServices[index] = updatedService;
      updateCampsiteData(
        'campSiteSelections',
        newServices.map(({ image, ...rest }) => rest)
      );
      updateServiceImages(updatedService.image);
      return newServices;
    });
  };

  const removeService = (index) => {
    setServices((prevServices) => {
      const newServices = prevServices.filter((_, i) => i !== index);
      updateCampsiteData(
        'campSiteSelections',
        newServices.map(({ image, ...rest }) => rest)
      );
      setServiceImages((prevImages) => prevImages.filter((_, i) => i !== index));
      return newServices;
    });
  };

  const resetCampsiteData = () => {
    setCampsiteData({
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
    });
    setCampsiteImages([]);
    setServiceImages([]);
    setCampTypeImages([]);
    setSelectedUtilities([]);
    setSelectedPlaceTypes([]);
    setServices([]);
    setCampTypes([]);
  };

  return (
    <CampsiteContext.Provider value={{
      campsiteData, updateCampsiteData,
      campsiteImages, updateCampsiteImages,
      serviceImages, updateServiceImages,
      campTypeImages, updateCampTypeImages,
      selectedUtilities, updateSelectedUtilities,
      selectedPlaceTypes, updateSelectedPlaceTypes,
      services, addService, updateService, removeService,
      campTypes, addCampType, updateCampType, removeCampType,
      resetCampsiteData,
    }}>
      {children}
    </CampsiteContext.Provider>
  );
}

export const useCampsite = () => useContext(CampsiteContext);