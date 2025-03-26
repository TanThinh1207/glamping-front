import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCampsite } from '../../../context/CampsiteContext';

const EditTitle = () => {
  const { campsite, fetchCampsiteDetails } = useCampsite();
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const { id } = useParams();

  useEffect(() => {
    setTitle(campsite.name || '');
    setOriginalTitle(campsite.name || '');
  }, [campsite]);

  const handleSave = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`, { name: title });
      fetchCampsiteDetails();
      console.log(campsite);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-79px)] relative">
      <h1 className='text-3xl text-gray-400'>Campsite Title</h1>
      <textarea
        className="w-full text-center text-4xl p-4 font-bold border-none outline-none bg-transparent resize-none focus:ring-0"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title here"
        autoFocus
      />

      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end z-50">
        <button
          onClick={handleSave}
          disabled={title === originalTitle}
          className={` px-6 py-2 rounded-lg 
            ${title !== originalTitle ? 'bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditTitle;