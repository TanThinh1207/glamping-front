import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';

const HostFrame = () => {
  return (
    <div>
        <Toaster position='bottom-right' expand={false}></Toaster>
        <NavigationBar/>
        <div className="pt-[70px]">
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default HostFrame