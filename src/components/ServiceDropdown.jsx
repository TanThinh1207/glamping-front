import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

const ServiceDropdown = ({ services }) => {
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const toggleDropdown = () => setOpen(!open);

    const selectService = (service) => {
        setSelectedService(service);
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="w-full pt-6 pb-4 font-canto flex items-center text-2xl"
                onClick={toggleDropdown}
            >
                <ChevronDownIcon size={20} className={`transition-transform mr-2 ${open ? 'rotate-180' : ''}`} />
                {selectedService ? `${selectedService.name}` : "Select a service"}

            </button>

            <ul
                className={`absolute w-full transition-all duration-500 ease-out overflow-hidden ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                {services.map((service) => (
                    <li
                        key={service.id}
                        className="px-4 py-3 hover:bg-blue-100 cursor-pointer font-canto"
                        onClick={() => selectService(service)}
                    >
                        {service.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceDropdown;