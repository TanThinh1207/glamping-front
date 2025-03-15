import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from 'sonner';
import Modal from '../components/Modal';
import thumb from '../assets/terrace.jpg';
import { updateUserData, fetchUserData } from '../service/UserService';

const Account = () => {
    const [loading , setLoading] = useState(true);
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const defaultText = "Vui lòng cập nhật";
    const [userData, setUserData] = useState({
        firstName: defaultText,
        lastName: defaultText,
        phone: defaultText,
        email: defaultText,
        address: defaultText,
        dob: defaultText
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fields = [
        { label: "First Name", key: "firstName" },
        { label: "Last Name", key: "lastName" },
        { label: "Phone", key: "phone" },
        { label: "Email", key: "email" },
        { label: "Address", key: "address" },
        { label: "Birthday", key: "dob" }
    ];

    const modalFields = fields.filter(field => field.key !== 'email');

    useEffect(() => {
        if (!user) {
            navigate("/login");
            toast.error("Please login to view your account!");
            return;
        }
        const reloadUser = async () => {
            setLoading(true);
            try {
                const newUser = await fetchUserData(user.id);
            setUserData({
                firstName: newUser.firstname ?? defaultText,
                lastName: newUser.lastname ?? defaultText,
                phone: newUser.phone ?? defaultText,
                email: newUser.email ?? defaultText,
                address: newUser.address ?? defaultText,
                dob: newUser.birthday ?? defaultText
            });
            } catch(error) {
                toast.error(`Failed to fetch user data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
        reloadUser();
    }, []);

    const handleUpdateUserData = async () => {
        setLoading(true);
        try {
            const backendData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                address: userData.address,
                dob: userData.dob,
              };
            console.log(backendData)
            await updateUserData(user.id, backendData);
            const updatedUser = await fetchUserData(user.id);
            console.log(updatedUser)
            console.log("updatedUser")
            setUserData({
                firstName: updatedUser.firstname || defaultText,
                lastName: updatedUser.lastname || defaultText,
                phone: updatedUser.phone || defaultText,
                email: updatedUser.email || defaultText,
                address: updatedUser.address || defaultText,
                dob: updatedUser.birthday || defaultText,
            });
            console.log(userData)
            console.log("userData")
    
            toast.success("User data updated successfully!");
        } catch (error) {
            toast.error(`Failed to update user data: ${error.message}`);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleInputChange = (key, value) => {
        setUserData(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }

    return (
        <div className='container-fluid mx-auto flex flex-col items-center min-h-screen'>
            <div className='relative h-80 w-full mb-12'>
                <img src={thumb} alt="Terrace" className='w-full h-full object-cover' />
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl md:text-3xl lg:text-4xl font-canto uppercase">
                    <p>Welcome, {userData.firstName !== defaultText ? userData.firstName : "Guest"}</p>
                </div>
            </div>

            <div className='flex justify-end w-full max-w-2xl px-10 lg:px-0'>
                <button
                    className='text-sm px-4 py-2 text-purple-900 hover:text-white hover:bg-purple-900 transition-colors duration-300 cursor-pointer'
                    onClick={() => setIsModalOpen(true)}
                >
                    EDIT PROFILE
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p className='text-center text-lg text-purple-900'>EDIT PROFILE</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 py-6 px-4'>
                    {modalFields.map(({ key, label }) => (
                        key === 'dob' ? (
                            <div key={key} className="relative my-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Birthday"
                                        value={userData.dob !== defaultText ? dayjs(userData.dob) : null}
                                        onChange={(newValue) =>
                                            handleInputChange('dob', newValue?.format("YYYY-MM-DD") || "")
                                        }
                                        slotProps={{ textField: { variant: "standard", fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </div>
                        ) : (
                            <div key={key} className="relative my-6">
                                <input
                                    type="text"
                                    value={userData[key] !== defaultText ? userData[key] : ""}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                    className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 border-b border-black appearance-none focus:outline-none focus:ring-0 peer"
                                    placeholder=" "
                                />
                                <label className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 left-0 text-gray-400 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1">
                                    {label}
                                </label>
                            </div>
                        )
                    ))}
                </div>
                <div className='flex justify-end'>
                    <button
                        className='text-sm px-4 py-2 text-purple-900 hover:text-white hover:bg-purple-900 transition-colors duration-300 cursor-pointer'
                        onClick={handleUpdateUserData}
                    >
                        UPDATE
                    </button>
                </div>
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-4xl mb-4 px-4 lg:px-0">
                {fields.map(({ label, key }) => (
                    <div key={key}>
                        <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                            {label}
                        </label>
                        <div className="w-full text-sm lg:text-lg font-light">
                            <p>{userData[key] !== defaultText ? userData[key] : "N/A"}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-end w-full max-w-2xl px-10 lg:px-0 pb-6'>
                <button
                    className='text-sm px-4 py-2 text-purple-900 hover:text-white hover:bg-purple-900 transition-colors duration-300 cursor-pointer'
                    onClick={handleLogout}
                >
                    LOG OUT
                </button>
            </div>
        </div>
    );
};

export default Account;
