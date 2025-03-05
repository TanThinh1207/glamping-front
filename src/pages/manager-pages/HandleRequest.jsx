import React from 'react'

const HandleRequest = () => {
    const createCampsiteRequests = [
        {
            id: 1,
            owner: 'Owner 1',
            phoneNumber: '0123456789',
            email: '1234@gmai.com',
            name: 'Campsite 1',
            location: 'Location 1',
            status: 'Pending'
        },
        {
            id: 2,
            owner: 'Owner 2',
            phoneNumber: '0123456789',
            email: '12345@gmail.com',
            name: 'Campsite 2',
            location: 'Location 2',
            status: 'Pending'
        },
        {
            id: 3,
            owner: 'Owner 3',
            phoneNumber: '0123456789',
            email: '123456@gmail.com',
            name: 'Campsite 3',
            location: 'Location 3',
            status: 'Pending'
        },
        {
            id: 4,
            owner: 'Owner 4',
            phoneNumber: '0123456789',
            email: '1234567@gmail.com',
            name: 'Campsite 4',
            location: 'Location 4',
            status: 'Pending'
        },
    ];
    return (
        <div className='w-full h-screen bg-white px-20 py-4'>
            <div>
                <h1 className='text-4xl font-semibold py-8'>Request</h1>
            </div>
            <div>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b-2 border-gray-300'>
                            <th className='text-left py-4'>Owner</th>
                            <th className='text-left py-4'>Phone Number</th>
                            <th className='text-left py-4'>Email</th>
                            <th className='text-left py-4'>Name</th>
                            <th className='text-left py-4'>Location</th>
                            <th className='text-center py-4'>Status</th>
                            <th className='text-center py-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {createCampsiteRequests.map((request) => (
                            <tr key={request.id} className='border-b border-gray-300'>
                                <td className='py-4'>{request.owner}</td>
                                <td className='py-4'>{request.phoneNumber}</td>
                                <td className='py-4'>{request.email}</td>
                                <td className='py-4'>{request.name}</td>
                                <td className='py-4'>{request.location}</td>
                                <td className='py-4 text-center'>{request.status}</td>
                                <td className='py-4 text-center space-x-4'>
                                    <button className='bg-green-500 text-white rounded-md px-4 py-2'>Approve</button>
                                    <button className='bg-red-500 text-white rounded-md px-4 py-2 '>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HandleRequest
