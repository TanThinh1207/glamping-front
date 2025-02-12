import React, { useState, useEffect } from "react"
import Modal from '../../components/Modal';
import axios from 'axios';

const ManageFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState({ id: "", name: "", description: "", image: "", status: true });
  const [searchTerm, setSearchTerm] = useState("");


  const filteredFacilities = facilities
    .filter((p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => p.status === true);


  const openModal = (facility = null) => {
    setSelectedFacility(
      facility || { id: "", name: "", description: "", image: "", status: true }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFacility({ id: "", name: "", description: "", image: "", status: true });
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (selectedFacility.id) {
        const url = `${import.meta.env.VITE_API_UPDATE_FACILITIES}`;
        const formData = new FormData();
        formData.append('id', selectedFacility.id);
        formData.append('name', selectedFacility.name);
        formData.append('description', selectedFacility.description);
        const response = await axios.post(url, formData);
        const returnedData = response.data.data;

        if (returnedData.id === selectedFacility.id) {
          setFacilities((prev) =>
            prev.map((facility) => (facility.id === returnedData.id ? returnedData : facility))
          );
          closeModal();
        } else {
          toast.error("Failed to update  facility. Please try again.");
          closeModal();
        }
      } else {
        const url = `${import.meta.env.VITE_API_CREATE_FACILITIES}`;
        const formData = new FormData();
        formData.append('name', selectedFacility.name);
        formData.append('description', selectedFacility.description);
        const response = await axios.post(url, formData);
        const newFacility = response.data.data;

        setFacilities((prev) => [...prev, newFacility]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving facility:", error);
    }
  };

  const handleDelete = async (facilityId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this facility?");
      if (!confirmDelete) return;

      const url = `${import.meta.env.VITE_API_DELETE_FACILITIES}${facilityId}`;
      await axios.post(url);

      const response = await axios.get(`${import.meta.env.VITE_API_GET_FACILITIES}`);
      setFacilities(response.data.data);
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFacility((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_GET_FACILITIES}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setFacilities(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching facilities data:", error);
      }
    };
    fetchFacilities();
  }, []);
  return (
    <div className='flex-1 p-5'>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Facility Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for facility"
            className="border p-2 w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="w-full ml-2 py-2 uppercase bg-transparent border-2 border-black text-black hover:bg-black hover:text-white border-solid transform transition-all duration-300 ease-in-out"
            onClick={() => openModal(true)}
          >
            Create Facility
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Status</th>
              {/* <th className="px-4 py-2 border-b">Image</th> */}
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.map((facility) => (
              <tr key={facility.id} className="text-center">
                <td className="px-4 py-2 border-b">{facility.id}</td>
                <td className="px-4 py-2 border-b">{facility.name}</td>
                <td className="px-4 py-2 border-b">{facility.description}</td>
                <td className="px-4 py-2 border-b">{facility.status ? "Active" : "Inactive"}</td>
                {/* <td className="px-4 py-2 border-b">{facility.image}</td> */}
                <td className="px-4 py-2 border-b space-x-2">
                  <button onClick={() => openModal(facility)} className="text-blue-500">Update</button>
                  <button onClick={() => handleDelete(facility.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className=" text-center py-2 mb-4">
          <h2 className="text-lg font-semibold">
            {selectedFacility.id ? "UPDATE FACILITY" : "CREATE FACILITY"}
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
                value={selectedFacility.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                name="description"
                className="w-full border p-2"
                value={selectedFacility.description || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type=""
                name="image"
                className="w-full border p-2"
                value={selectedFacility.image || ""}
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

export default ManageFacility
