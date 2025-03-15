import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';

const ManageAccount = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ id: "", firstname: "", lastname: "", address: "", email: "", birthday: "", phone: "", status: true });
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const filteredUsers = users
        .filter((p) => p.firstname && p.firstname.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((p) => p.lastname && p.lastname.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((p) => p.status === true);


    const openModal = (user = null) => {
        setSelectedUser(
            user || { id: "", firstname: "", lastname: "", address: "", email: "", birthday: "", phone: "", status: true }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser({ id: "", firstname: "", lastname: "", address: "", email: "", birthday: "", phone: "", status: true });
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        try {
            if (selectedUser.id) {
                const url = `${import.meta.env.VITE_API_USER_ID}${selectedUser.id}`;
                const object = {
                    firstName: selectedUser.firstname,
                    lastName: selectedUser.lastname,
                    address: selectedUser.address,
                    phone: selectedUser.phone,
                    dob: selectedUser.birthday,
                    status: selectedUser.status,
                }
                const response = await axios.put(url, object);
                const returnedData = response.data.data;

                if (returnedData.id === selectedUser.id) {
                    setUsers((prev) =>
                        prev.map((user) => (user.id === returnedData.id ? returnedData : user))
                    );
                    closeModal();
                } else {
                    toast.error("Failed to update  user. Please try again.");
                    closeModal();
                }
            }

            closeModal();
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (!confirmDelete) return;

            const url = `${import.meta.env.VITE_API_DELETE_USERS}${userId}`;
            await axios.delete(url);

            const response = await axios.get(`${import.meta.env.VITE_API_GET_USERS}`);
            setUsers(response.data.data.content);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_GET_USERS}?page=${currentPage}&size=${pageSize}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error("Error fetching users data:", error);
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
        fetchUsers();
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
                <h1 className="text-2xl font-semibold">User Management</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search for user"
                        className="border p-2 w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">First Name</th>
                            <th className="px-4 py-2 border-b">Last Name</th>
                            <th className="px-4 py-2 border-b">Address</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Phone</th>
                            <th className="px-4 py-2 border-b">Date of birth</th>
                            <th className="px-4 py-2 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="px-4 py-2 border-b">{user.id}</td>
                                <td className="px-4 py-2 border-b">{user.firstname}</td>
                                <td className="px-4 py-2 border-b">{user.lastname}</td>
                                <td className="px-4 py-2 border-b">{user.address}</td>
                                <td className="px-4 py-2 border-b">{user.email}</td>
                                <td className="px-4 py-2 border-b">{user.phone}</td>
                                <td className="px-4 py-2 border-b">{user.birthday}</td>
                                <td className="px-4 py-2 border-b">
                                    <button onClick={() => openModal(user)} className="text-blue-500">Update</button>
                                    <button onClick={() => handleDelete(user.id)} className="ml-2 text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderPagination()}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center py-2 mb-4">
                    <h2 className="text-lg font-semibold">
                        {selectedUser.id ? "UPDATE USER" : "CREATE USER"}
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            className="w-full border p-2"
                            value={selectedUser.firstname || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            className="w-full border p-2"
                            value={selectedUser.lastname || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Address</label>
                        <input
                            type="text"
                            name="address"
                            className="w-full border p-2"
                            value={selectedUser.address || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="w-full border p-2"
                            value={selectedUser.phone || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date of birth</label>
                        <input
                            type="text"
                            name="dob"
                            className="w-full border p-2"
                            value={selectedUser.birthday || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-black text-white px-4 py-2"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-300 text-black px-4 py-2"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}

export default ManageAccount
