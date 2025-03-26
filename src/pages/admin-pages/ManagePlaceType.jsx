import React, { useState, useEffect } from 'react'
import Modal from '../../components/Modal';
import axios from 'axios';
const ManagePlaceType = () => {
  const [placeTypes, setPlaceTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaceType, setSelectedPlaceType] = useState({ id: "", name: "", image: "", status: "active" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  
  const accessToken = localStorage.getItem("accessToken");

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
        const url = `${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}`;

        const object = {
          id: selectedPlaceType.id,
          name: selectedPlaceType.name,
        }
        const response = await axios({
          method: 'PUT',
          url: url,
          data: object,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
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
        const url = `${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}`;
        const response = await axios({
          method: 'POST',
          url: `${url}?name=${encodeURIComponent(selectedPlaceType.name)}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
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

      const url = `${import.meta.env.VITE_API_PLACETYPE_BY_ID_ENDPOINT}${placeTypeId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const response = await axios.get(`${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}`);
      setPlaceTypes(response.data.data.content);
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

  const fetchPlaceTypes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PLACETYPES_ENDPOINT}?page=${currentPage}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setPlaceTypes(response.data.data.content);
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.error("Error fetching place type data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceTypes();
  }, [currentPage]);

  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 ${currentPage === i ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
      </div>
    );
  }

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

      {renderPagination()}

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
