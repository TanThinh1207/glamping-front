import React from 'react';

const BookingSummary = () => {
    return (
        <div className="w-full bg-[#F5F3EB] p-6 shadow-md text-[#3C2F2F] font-sans">
            <h2 className="text-xl font-semibold mb-4">Six Senses Kanuhura</h2>

            <div className="mb-3">
                <p><span className="font-semibold">Arrival:</span> February 21, 2025</p>
                <p><span className="font-semibold">Departure:</span> February 23, 2025</p>
                <p><span className="font-semibold">Number of nights:</span> 2</p>
                <p className="text-purple-800 cursor-pointer mt-1">Edit</p>
            </div>

            <div className="mb-3">
                <p><span className="font-semibold">Room 1:</span> Beach Villa With Pool</p>
                <p><span className="font-semibold">Rate:</span> Best Flexible Rate</p>
                <p><span className="font-semibold">Guests:</span> 2 Adults</p>
            </div>

            <div className="border-t border-gray-300 pt-3">
                <p className="text-sm text-gray-600">Total 2 nights (taxes incl.):</p>
                <p className="text-xl font-bold mt-1">VND 100,666,104</p>
                <p className="text-purple-800 cursor-pointer mt-2">Price Breakdown</p>
            </div>

            <p className="mt-4 text-sm text-gray-500 cursor-pointer">Cancellation & deposit policies</p>

            <button className="w-full mt-6 py-3 border border-purple-800 text-purple-800 font-semibold rounded-full hover:bg-purple-100 transition">
                SKIP - YOU CAN ADD THEM LATER
            </button>
        </div>
    );
};

export default BookingSummary;
