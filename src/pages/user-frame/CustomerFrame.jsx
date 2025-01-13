import React from 'react'
import { Toaster } from 'sonner'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import { Outlet, useLocation } from 'react-router-dom'

const CustomerFrame = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <div>
      <Toaster position='bottom-right' expand={false}></Toaster>
      <NavigationBar />
      <div className={`${isHomePage ? "" : "pt-[73.23px]"}`}>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  )
}

export default CustomerFrame
