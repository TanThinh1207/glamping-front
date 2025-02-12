import React, { useState, useEffect } from "react"
import Modal from '../../components/Modal';
import axios from 'axios';

const ManageUtility = () => {
  const [utilities, setUtilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState({ id: "", name: "", image: "", status: true });
  const [searchTerm, setSearchTerm] = useState("");


  const filteredUtilities = utilities
    .filter((p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.status === true);


  const openModal = (utility = null) => {
    setSelectedUtility(
      utility || { id: "", name: "", image: "", status: true }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUtility({ id: "", name: "", image: "", status: true });
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selectedUtility.id) {
        const url = `${import.meta.env.VITE_API_UPDATE_UTILITIES}`;
        const formData = new FormData();
        formData.append('id', selectedUtility.id);
        formData.append('name', selectedUtility.name);
        const response = await axios.post(url, formData);
        const returnedData = response.data.data;

        if (returnedData.id === selectedUtility.id) {
          setUtilities((prev) =>
            prev.map((utility) => (utility.id === returnedData.id ? returnedData : utility))
          );
          closeModal();
        } else {
          toast.error("Failed to update  utility. Please try again.");
          closeModal();
        }
      } else {
        const url = `${import.meta.env.VITE_API_CREATE_UTILITIES}`;
        const formData = new FormData();
        formData.append('name', selectedUtility.name);
        const response = await axios.post(url, formData);
        const newUtility = response.data.data;

        setUtilities((prev) => [...prev, newUtility]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving utility:", error);
    }
  };

  const handleDelete = async (utilityId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this utility?");
      if (!confirmDelete) return;

      const url = `${import.meta.env.VITE_API_DELETE_UTILITIES}?id=${utilityId}`;
      await axios.post(url);

      const response = await axios.get(`${import.meta.env.VITE_API_GET_UTILITIES}`);
      setUtilities(response.data.data);
    } catch (error) {
      console.error("Error deleting utility:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUtility((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_GET_UTILITIES}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUtilities(response.data.data);
      } catch (error) {
        console.error("Error fetching utilities data:", error);
      }
    };
    fetchUtilities();
  }, []);
  return (
    <div className='flex-1 p-5'>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Utility Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for utility"
            className="border p-2 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="w-full ml-2 py-2 uppercase bg-transparent border-2 border-black text-black hover:bg-black hover:text-white border-solid transform transition-all duration-300 ease-in-out"
            onClick={() => openModal(true)}
          >
            Create Utility
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
            {filteredUtilities.map((utility) => (
              <tr key={utility.id} className="text-center">
                <td className="px-4 py-2 border-b">{utility.id}</td>
                <td className="px-4 py-2 border-b">{utility.name}</td>
                <td className="px-4 py-2 border-b">{utility.status ? "Active" : "Inactive"}</td>
                {/* <td className="px-4 py-2 border-b">{utility.image}</td> */}
                <td className="px-4 py-2 border-b space-x-2">
                  <button onClick={() => openModal(utility)} className="text-blue-500">Update</button>
                  <button onClick={() => handleDelete(utility.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className=" text-center py-2 mb-4">
          <h2 className="text-lg font-semibold">
            {selectedUtility.id ? "UPDATE UTILITY" : "CREATE UTILITY"}
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
                value={selectedUtility.name || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type=""
                name="image"
                className="w-full border p-2"
                value={selectedUtility.image || ""}
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

export default ManageUtility
