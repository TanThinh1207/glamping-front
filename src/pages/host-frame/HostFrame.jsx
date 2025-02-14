import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import CreateCampsiteFooter from '../../components/CreateCampsiteFooter';
const HostFrame = () => {
  const location = useLocation()
  return (
    <div>
        <Toaster position='bottom-right' expand={false}></Toaster>
        <NavigationBar/>
        <div className="pt-[70px]">
            <Outlet/>
        </div>
        {location.pathname.startsWith(`/hosting/create-campsite`) ? (
          <CreateCampsiteFooter/>
        )
        : (
            <Footer/>
        )}
        
    </div>
  )
}

export default HostFrame