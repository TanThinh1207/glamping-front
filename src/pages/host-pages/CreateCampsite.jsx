import React from 'react'
import { useParams } from 'react-router-dom'

const CreateCampsite = () => {
    const {id} = useParams();
    return (
        <div>CreateCampsite: {id}</div>
    )
}

export default CreateCampsite