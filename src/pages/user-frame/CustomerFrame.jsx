import React from 'react'
import { Toaster } from 'sonner'
import NavigationBar from '../../components/NavigationBar'
import Footer from '../../components/Footer'
import { Outlet } from 'react-router-dom'

const CustomerFrame = () => {
  return (
    <div>
      <Toaster position='bottom-right' expand={false}></Toaster>
      <NavigationBar />
      <div>
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  )
}

export default CustomerFrame
