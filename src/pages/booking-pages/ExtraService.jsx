import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import BookingSummary from '../../components/BookingSummary';
import { useBooking } from '../../context/BookingContext';

const ExtraService = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [serviceQuantities, setServiceQuantities] = useState({});

    const { updateServices } = useBooking();

    const toggleDropdown = (serviceId) => {
        setOpenStates((prev) => ({
            ...prev,
            [serviceId]: !prev[serviceId]
        }));
    };

    const handleQuantityChange = (serviceId, quantity) => {
        const validQuantity = Math.max(0, parseInt(quantity) || 0);
        setServiceQuantities((prev) => ({
            ...prev,
            [serviceId]: validQuantity
        }));
    };

    useEffect(() => {
        if (Object.keys(serviceQuantities).length > 0) {
            updateServices(serviceQuantities);
        }
    }, [serviceQuantities, updateServices]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_GET_SERVICES}`);
            if (!response.ok) throw new Error(`Failed to fetch services: ${response.statusText}`);

            const data = await response.json();
            setServices(data.data);

            const initialStates = data.data.reduce((acc, service) => {
                acc[service.id] = false;
                return acc;
            }, {});
            setOpenStates(initialStates);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const selectedServices = useMemo(() => 
        services.filter(service => serviceQuantities[service.id] > 0)
        .map(service => ({
            id: service.id,
            name: service.name,
            quantity: serviceQuantities[service.id],
            price: service.price
        })),
        [services, serviceQuantities]
    );

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="animate-spin rounded-full border-t-4 border-teal-400 border-solid h-16 w-16"></div>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container fluid mx-auto pt-16 flex flex-col lg:flex-row gap-10'>
            <div className='lg:w-2/3 w-full'>
                <p className='text-4xl font-canto'>Extras & Services</p>
                {services.map((service) => (
                    <div key={service.id} className="relative mb-4 border-b border-gray-300">
                        <div
                            className="px-4 py-3 cursor-pointer flex items-center font-canto text-xl"
                            onClick={() => toggleDropdown(service.id)}
                        >
                            <ChevronDownIcon
                                size={20}
                                className={`transition-transform mr-2 ${openStates[service.id] ? 'rotate-180' : ''}`}
                            />
                            {service.name}
                        </div>
                        <div
                            className={`max-h-0 overflow-hidden transition-all duration-300 px-4 ${openStates[service.id] ? 'max-h-40 py-3 opacity-100' : 'opacity-0'
                                }`}
                        >
                            <p className="text-gray-700 pb-2">{service.description}</p>
                            <div className='flex justify-between'>
                                <p className='text-gray-700'>Price <span className='font-bold'>VND {service.price}</span></p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Qty:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-16 border border-gray-300 rounded p-1 text-center"
                                        value={serviceQuantities[service.id] || ''}
                                        onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="lg:w-1/3 w-full">
                <BookingSummary selectedServices={selectedServices} />
            </div>
        </div>
    );
};

export default ExtraService;
