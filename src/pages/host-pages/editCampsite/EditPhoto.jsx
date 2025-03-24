import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditPhoto = () => {
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modified, setModified] = useState(false); // Track changes

  useEffect(() => {
    const fetchCampsiteDetails = async () => {
      try {
        console.log('Fetching campsite with ID:', id);
        const response = await axios.get(`${import.meta.env.VITE_API_GET_CAMPSITES}`, {
          headers: { 'Content-Type': 'application/json' },
          params: { id: id }
        });
        setImages(response.data.data.content[0].imageList);
      } catch (error) {
        console.error('Error fetching campsite data:', error);
      }
    };

    if (id) fetchCampsiteDetails();
  }, [id]);

  // Open modal
  const openModal = (imagePath) => setSelectedImage(imagePath);

  // Close modal
  const closeModal = () => setSelectedImage(null);

  // Delete image from the list
  const deleteImage = () => {
    setImages(images.filter((image) => image.path !== selectedImage));
    setModified(true);
    closeModal();
  };

  // Handle file selection
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const newImages = [...images];

    for (const file of files) {
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ path: imageUrl });
    }

    setImages(newImages);
    setModified(true);
  };

  // Save changes 
  const saveChanges = () => {
    try {
      axios.patch(`${import.meta.env.VITE_API_GET_CAMPSITES}/${id}`, { imageList: images });
      setModified(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  useEffect(() => {
    console.log(images);
  }, [images]);
  return (
    <div>
      <div className='min-h-screen px-44 pb-20 relative'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-semibold'>Campsite photos</h1>
            <h2 className='text-lg text-gray-400'>Manage photos.</h2>
          </div>
          <label className='w-10 h-10 flex items-center justify-center text-xl text-black bg-gray-100 rounded-full cursor-pointer'>
            <input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleImageUpload}
            />
            <FontAwesomeIcon icon={faPlus} />
          </label>
        </div>
        <div className='grid grid-cols-3 gap-4 mt-4'>
          {images.map((image, index) => (
            <div key={index} className='cursor-pointer relative group'>
              <img
                src={image.path}
                alt='campsite'
                className='w-72 h-72 object-cover rounded-lg'
                onClick={() => openModal(image.path)}
              />
            </div>
          ))}
        </div>
        {selectedImage && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50' onClick={closeModal}>
            <div className='relative bg-white rounded-lg shadow-lg w-[30%]  flex justify-center' onClick={(e) => e.stopPropagation()}>
              <button className='absolute top-2 right-2 text-purple-900' onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} size='xl' />
              </button>
              <button className='absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center' onClick={deleteImage}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <img src={selectedImage} alt='Selected' className='w-full h-auto object-cover rounded-lg' />
            </div>
          </div>
        )}

      </div>
      {modified && (
        <div className='fixed bottom-0 left-0 w-full bg-white border-t-2 p-4 flex justify-end'>
          <button className='bg-purple-900 text-white hover:bg-transparent border border-purple-900 hover:text-purple-900 transform transition duration-300 px-6 py-2 rounded-lg'
            onClick={saveChanges}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditPhoto;
