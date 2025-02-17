import React, { useState } from 'react'
import BookingSummary from '../../components/BookingSummary'
import Modal from '../../components/Modal';
import { FaCreditCard } from 'react-icons/fa';

const GuestInfo = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [birthday, setBirthday] = useState("");
    const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);

    return (
        <div className='container fluid mx-auto pt-16 flex flex-col lg:flex-row gap-10'>
            <div className='lg:w-2/3 w-full'>
                <p className='text-4xl font-canto'>Guest Information</p>
                <div className='gap-x-10 py-8 px-4'>
                    <div className="relative my-6 pb-5">
                        <input
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            First Name
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <input
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Last Name
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Email
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <input
                            type="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Phone
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <input
                            type="text"
                            onChange={(e) => setAddress(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Address
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <button
                            onClick={() => setIsBirthdayModalOpen(true)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black text-left"
                        >
                            {birthday || "Select Birthday"}
                        </button>
                        <label
                            className="absolute duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-sm text-gray-400"
                        >
                            Birthday
                        </label>
                    </div>
                    <Modal isOpen={isBirthdayModalOpen} onClose={() => setIsBirthdayModalOpen(false)}
                        className="p-4 bg-white rounded shadow-md"
                    >
                        <div className='flex flex-col items-center'>
                            <h2 className="text-md font-semibold mb-4">Select Birthday</h2>
                            <input
                                type="date"
                                onChange={(e) => setBirthday(e.target.value)}
                                className="w-full border p-2"
                            />
                            <button
                                onClick={() => setIsBirthdayModalOpen(false)}
                                className="mt-4 px-4 py-2 bg-black border border-black text-white w-full transform 
                                duration-300 hover:text-black hover:bg-transparent hover:border hover:border-black"
                            >
                                Confirm
                            </button>
                        </div>
                    </Modal>
                    {/* <button
                        className="mt-4 px-4 py-2 bg-black border border-black text-white w-full transform 
                                duration-300 hover:text-black hover:bg-transparent hover:border hover:border-black"
                    >
                        Confirm Reservation
                    </button> */}
                    <button
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-black border border-black text-white w-full transform 
                                duration-300 hover:text-black hover:bg-transparent hover:border hover:border-black"
                    >
                        <FaCreditCard /> DEPOSIT BY VNPAY
                    </button>
                </div>
            </div>
            <div className='lg:w-1/3 w-full'>
                <BookingSummary />
            </div>
        </div>
    )
}

export default GuestInfo
