import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCampsite } from '../../../context/CampsiteContext';

const EditPlaceType = () => {
  const [placeType, setPlaceType] = useState([]);
  const { id } = useParams();
  const { campsite, fetchCampsiteDetails } = useCampsite();
  const [campsitePlaceType, setCampsitePlaceType] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (campsite.campSitePlaceTypeList) {
      setCampsitePlaceType(campsite.campSitePlaceTypeList.map(pt => pt.id));
    }
  }, [campsite]);

  useEffect(() => {
    const fetchPlaceType = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}`);
        setPlaceType(response.data.data.content);
      } catch (error) {
        console.error('Error fetching place type data:', error);
      }
    };

    if (id) fetchPlaceType();
  }, [id]);

  const togglePlaceType = (typeId) => {
    setCampsitePlaceType((prev) => {
      const isSelected = prev.includes(typeId);
      const updatedList = isSelected ? prev.filter((id) => id !== typeId) : [...prev, typeId];
      setHasChanges(true);
      console.log('Updated place type list:', updatedList);
      return updatedList;
    });
  };

  const handleSave = async () => {
    try {
      console.log('Saving place type data:', campsitePlaceType);

      await axios.put(
        `${import.meta.env.VITE_API_GET_CAMPSITES}/${id}/place-types/`, campsitePlaceType);

      setHasChanges(false);
      fetchCampsiteDetails();
    } catch (error) {
      console.error('Error saving place type data:', error);
    }
  };

  return (
    <div className='min-h-screen px-44 pb-20 relative'>
      <h1 className='text-3xl font-semibold mb-4'>Campsite's Place Type</h1>
      <div className='flex flex-wrap gap-4 mt-10'>
        {placeType.map((type) => (
          <button
            key={type.id}
            className={`px-4 py-2 text-3xl font-bold rounded-full border-2 ${campsitePlaceType.includes(type.id) ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-400'}`}
            onClick={() => togglePlaceType(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>
      {hasChanges && (
        <div className='fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end z-50'>
          <button className='bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300 px-6 py-2 rounded-lg'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditPlaceType;
