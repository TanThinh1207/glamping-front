import React, { useEffect, useState } from 'react'
import ListingEditor from '../../components/ListingEditor'
import { useParams, useNavigate, Outlet, useLocation} from 'react-router-dom'
const DetailCampsite = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === `/hosting/listings/editor/${id}/details`) {
            navigate(`/hosting/listings/editor/${id}/details/photo`, { replace: true });
        }
    }, [id, location.pathname, navigate]);
    
    return (
        <div className='w-full h-screen bg-white mt-10 flex overflow-hidden'>
            <div className='w-1/4 ml-20 h-full overflow-auto'>
                <ListingEditor />
            </div>
            <div className='w-3/4 h-full overflow-auto'>
                <Outlet/>
            </div>
        </div>
    )
}

export default DetailCampsite