import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCampsite } from '../../../context/CampsiteContext';


const EditAmenities = () => {
  const { id } = useParams();
  const { campsite, fetchCampsiteDetails } = useCampsite();
  const [amenities, setAmenities] = useState([]);
  const [campsiteAmenities, setCampsiteAmenities] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campsite.campSiteUtilityList) {
      setCampsiteAmenities(campsite.campSiteUtilityList.map(a => a.id));
    }
  }, [campsite]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_UTILITIES_ENDPOINT}`);
        setAmenities(response.data.data.content);
      } catch (error) {
        console.error('Error fetching amenities data:', error);
      }
    };

    if (id) fetchAmenities();
  }, [id]);

  const toggleAmenities = (typeId) => {
    setCampsiteAmenities((prev) => {
      const isSelected = prev.includes(typeId);
      const updatedList = isSelected ? prev.filter((id) => id !== typeId) : [...prev, typeId];
      setHasChanges(true);
      console.log('Updated utilities list:', updatedList);
      return updatedList;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Saving utilities data:', campsiteAmenities);
      await axios.put(
        `${import.meta.env.VITE_API_GET_CAMPSITES}/${id}/utilities/`, campsiteAmenities);

      setHasChanges(false);
      fetchCampsiteDetails();
    } catch (error) {
      console.error('Error saving place type data:', error);
    } finally {
      setLoading(false);
    }
  };
  const isFormValid = campsiteAmenities.length > 0;
  return (
    <div className='min-h-screen px-44 pb-20 relative'>
      <h1 className='text-3xl font-semibold mb-4'>Campsite's amenities</h1>
      <div className='flex flex-wrap gap-4 mt-10'>
        {amenities.map((utility) => (
          <button
            key={utility.id}
            className={`px-4 py-2 text-3xl font-bold rounded-full border-2 ${campsiteAmenities.includes(utility.id) ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-400'}`}
            onClick={() => toggleAmenities(utility.id)}
          >
            {utility.name}
          </button>
        ))}
      </div>
      {hasChanges && (
        <div className='fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end z-50'>
          <button className={`px-6 py-2 rounded-lg ${isFormValid
              ? 'bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid}
            onClick={handleSave}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full border-t-4 border-white border-solid h-5 w-5"></div>
                <span>Saving . . .</span>
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default EditAmenities