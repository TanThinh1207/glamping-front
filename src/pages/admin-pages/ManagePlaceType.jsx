import React, { useState, useEffect } from 'react'
import Modal from '../../components/Modal';
import axios from 'axios';
const ManagePlaceType = () => {
  const [placeTypes, setPlaceTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaceType, setSelectedPlaceType] = useState({ id: "", name: "", image: "", status: "active" });
  const [searchTerm, setSearchTerm] = useState("");


  const filteredPlacetypes = placeTypes
    .filter((p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.status === true);


  const openModal = (placeType = null) => {
    setSelectedPlaceType(
      placeType || { id: "", name: "", image: "", status: "active" }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlaceType({ id: "", name: "", image: "", status: "active" });
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selectedPlaceType.id) {
        const url = `${import.meta.env.VITE_API_UPDATE_PLACETYPES}`;

        const object = {
          id: selectedPlaceType.id,
          name: selectedPlaceType.name,
        }
        const response = await axios.post(url, object);
        const returnedData = response.data.data;

        if (returnedData.id === selectedPlaceType.id) {
          setPlaceTypes((prev) =>
            prev.map((placeType) => (placeType.id === returnedData.id ? returnedData : placeType))
          );
          closeModal();
        } else {
          toast.error("Failed to update place type. Please try again.");
          closeModal();
        }
      } else {
        const url = `${import.meta.env.VITE_API_CREATE_PLACETYPES}`;
        const formData = new FormData();
        formData.append('name', selectedPlaceType.name);
        const response = await axios.post(url, formData);
        const newPlaceType = response.data.data;

        setPlaceTypes((prev) => [...prev, newPlaceType]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving place type:", error);
    }
  };

  const handleDelete = async (placeTypeId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this place type?");
      if (!confirmDelete) return;

      const url = `${import.meta.env.VITE_API_DELETE_PLACETYPES}${placeTypeId}`;
      await axios.delete(url);

      const response = await axios.get(`${import.meta.env.VITE_API_GET_PLACETYPES}`);
      setPlaceTypes(response.data.data);
    } catch (error) {
      console.error("Error deleting place type:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlaceType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchPlaceTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_GET_PLACETYPES}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setPlaceTypes(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching place type data:", error);
      }
    };
    fetchPlaceTypes();
  }, []);

  return (
    <div className='flex-1 p-5'>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Place Type Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for place type"
            className="border p-2 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="w-full ml-2 py-2 uppercase bg-transparent border-2 border-black text-black hover:bg-black hover:text-white border-solid transform transition-all duration-300 ease-in-out"
            onClick={() => openModal(true)}
          >
            Create Place Type
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Status</th>
              {/* <th className="px-4 py-2 border-b">Image</th> */}
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlacetypes.map((placeType) => (
              <tr key={placeType.id} className="text-center">
                <td className="px-4 py-2 border-b">{placeType.id}</td>
                <td className="px-4 py-2 border-b">{placeType.name}</td>
                <td className="px-4 py-2 border-b">{placeType.status ? "Active" : "Inactive"}</td>
                {/* <td className="px-4 py-2 border-b">{placeType.image}</td> */}
                <td className="px-4 py-2 border-b space-x-2">
                  <button onClick={() => openModal(placeType)} className="text-blue-500">Update</button>
                  <button onClick={() => handleDelete(placeType.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className=" text-center py-2 mb-4">
          <h2 className="text-lg font-semibold">
            {selectedPlaceType.id ? "UPDATE PLACE TYPE" : "CREATE PLACE TYPE"}
          </h2>
        </div>
        <div className="gap-3">
          <div className="flex flex-col justify-between gap-5">
            <div className="w-full">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="w-full border p-2"
                value={selectedPlaceType.name || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type=""
                name="image"
                className="w-full border p-2"
                value={selectedPlaceType.image || ""}
                onChange={handleInputChange}
              />
            </div> */}
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="bg-black text-white px-4 py-2" onClick={handleSave}>Save</button>
            <button className="bg-gray-300 text-black px-4 py-2" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManagePlaceType
