import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';

const ManageAccount = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState({ id: "", firstname: "", lastname: "", address: "", email: "", birthday: "", phone: "", status: true });
    const [searchTerm, setSearchTerm] = useState("");


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
                const url = `${import.meta.env.VITE_API_UPDATE_USERS}/${selectedUser.id}`;
                const object = {
                    firstName: selectedUser.firstname,
                    lastName: selectedUser.lastname,
                    address: selectedUser.address,
                    phone: selectedUser.phone,
                    dob: selectedUser.birthday,
                    status: selectedUser.status,
                }
                const response = await axios.post(url, object);
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

            const url = `${import.meta.env.VITE_API_DELETE_USERS}/${userId}`;
            await axios.post(url);

            const response = await axios.get(`${import.meta.env.VITE_API_GET_USERS}`);
            setUsers(response.data.data);
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_GET_USERS}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };
        fetchUsers();
    }, []);

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
