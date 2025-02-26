import React from 'react'
import { useState } from 'react';
import thumb from '../assets/terrace.jpg';
import Modal from '../components/Modal';

const Account = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    
    return (
        <div className='container-fluid mx-auto flex flex-col items-center min-h-screen'>
            <div className='flex relative h-80 w-full mb-12'>
                <img src={thumb} alt="" className='w-full h-full object-cover' />
                <div className="absolute inset-0 text-white flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-canto w-full uppercase text-center">
                    <p>Welcome, </p>
                </div>
            </div>

            <div className='flex justify-end w-full max-w-2xl px-10 lg:px-0'>
                <button className='text-sm text-purple-900 hover:text-blue-700 transition-colors duration-300 cursor-pointer'
                    onClick={() => setIsModalOpen(true)}
                >
                    EDIT PROFILE
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p className='text-center text-lg text-purple-900'>EDIT PROFILE</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 py-8 px-4'>
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
                            className="absolute text-sm duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-gray-400
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
                            className="absolute text-sm duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Last Name
                        </label>
                    </div>
                    <div className="relative my-6 pb-5">
                        <input
                            type="text"
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full py-2 px-0 text-sm text-black bg-transparent border-0 
                                    border-b border-black appearance-none 
                                    focus:outline-none focus:ring-0 focus:text-black peer"
                            placeholder=""
                            required
                        />
                        <label
                            className="absolute text-sm duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-gray-400
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
                            className="absolute text-sm duration-300 transform -translate-y-6 scale-75
                                    top-3 left-0 z-9 origin-[0] text-gray-400
                                    peer-focus:left-0 peer-focus:text-blue-400
                                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 "
                        >
                            Address
                        </label>
                    </div>
                </div>
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 w-full max-w-4xl mb-4 px-4 lg:px-0">
                <div>
                    <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                        first name
                    </label>
                    <div className="w-full text-sm lg:text-lg font-light">
                        <p>first name</p>
                    </div>
                </div>
                <div>

                    <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                        last name
                    </label>
                    <div className="w-full text-sm lg:text-lg font-light">
                        <p>last name</p>
                    </div>
                </div>
                <div>
                    <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                        PHONE
                    </label>
                    <div className="w-full text-sm lg:text-lg font-light">
                        <p>Phone</p>
                    </div>
                </div>
                <div>
                    <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                        Email
                    </label>
                    <div className="w-full text-sm lg:text-lg font-light">
                        <p>Email</p>
                    </div>
                </div>
                <div>
                    <label className="block text-xs mb-1 uppercase tracking-wider font-medium">
                        ADDRESS
                    </label>
                    <div className="w-full text-sm lg:text-lg font-light">
                        <p>Address</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account
