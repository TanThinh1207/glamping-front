import React, { useState, useEffect } from "react";
import Modal from '../../components/Modal';
import axios from 'axios';
import { toast } from "sonner";

const ManageFacility = () => {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    status: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  const accessToken = localStorage.getItem("accessToken");

  const filteredFacilities = facilities
    .filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      p.status === true
    );

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
        const url = `${import.meta.env.VITE_API_FACILITIES_ENDPOINT}`;
        const formData = new FormData();
        formData.append('id', selectedFacility.id);
        formData.append('name', selectedFacility.name);
        formData.append('description', selectedFacility.description);
        console.log(selectedFacility);
        const response = await axios.put(url, formData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        });
        console.log(response);
        const returnedData = response.data.data;

        if (returnedData.id === selectedFacility.id) {
          setFacilities((prev) =>
            prev.map((facility) => (facility.id === returnedData.id ? returnedData : facility))
          );
          closeModal();
        } else {
          toast.error("Failed to update facility. Please try again.");
          closeModal();
        }
      } else {
        const url = `${import.meta.env.VITE_API_FACILITIES_ENDPOINT}`;
        const formData = new FormData();
        formData.append('name', selectedFacility.name);
        formData.append('description', selectedFacility.description);
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });
        const newFacility = response.data.data;
        console.log(newFacility);
        setFacilities((prev) => [...prev, newFacility]);
        console.log(facilities);
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

      await axios.delete(`${import.meta.env.VITE_API_FACILITIES_BY_ID_ENDPOINT}${facilityId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      }
      );

      await fetchFacilities();
      toast.success("Facility deleted successfully");
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete facility");
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFacility((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_FACILITIES_ENDPOINT}?page=${currentPage}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const responseData = response.data.data;
      setFacilities(responseData.content);
      setTotalPages(responseData.totalPages);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast.error("Failed to load facilities");
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchFacilities();
  }, [currentPage]);

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

      {renderPagination()}

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
