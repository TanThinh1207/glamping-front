import React from 'react'
import { useParams } from 'react-router-dom'

const Campsite = () => {
    const { location } = useParams();

    return (
        <div className='p-10'>
            <h1 className='text-4xl font-bold capitalize'>{location.replace("-", " ")}</h1>
            <p className='mt-4 text-lg'>Welcome to the {location.replace("-", " ")} glamping experience!</p>
        </div>
    )
}

export default Campsite
