import React, { useEffect, useState } from 'react'
import ListingEditor from '../../components/ListingEditor'
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { CampsiteProvider } from '../../context/CampsiteContext'

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
        <CampsiteProvider>
            <div className='w-full bg-white mt-10 flex'>
                <div className='w-1/4 ml-20 overflow-y-auto h-screen'>
                    <ListingEditor />
                </div>
                <div className='w-3/4'>
                    <Outlet />
                </div>
            </div>
        </CampsiteProvider>
    )
}

export default DetailCampsite