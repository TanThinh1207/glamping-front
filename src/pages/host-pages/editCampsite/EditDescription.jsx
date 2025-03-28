import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCampsite } from '../../../context/CampsiteContext';

const EditDescription = () => {
  const { campsite, fetchCampsiteDetails } = useCampsite();
  const [description, setDescription] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescription(campsite.description || '');
    setOriginalDescription(campsite.description || '');
  }, [campsite]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.patch(`${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`, { description: description });
      fetchCampsiteDetails();
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-70px)] relative">
      <h1 className='text-3xl text-gray-400'>Campsite Description</h1>
      <textarea
        className="w-full h-60 text-4xl font-bold p-4 text-center flex items-center justify-center border-none outline-none bg-transparent resize-none focus:ring-0"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description here"
        autoFocus
      />


      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading || description.trim() === '' || description === originalDescription}
          className={`px-6 py-2 rounded-lg 
              ${description.trim() !== '' && description !== originalDescription
              ? 'bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
    </div>
  );
};

export default EditDescription;