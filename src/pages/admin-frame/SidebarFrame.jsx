import React from 'react'
import { Outlet } from 'react-router-dom';
import { faUsers, faCar, faMountainSun, faMugHot } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/SideBar';
import { Toaster } from 'sonner';

const SidebarFrame = () => {
  const sidebarItems = [
    { title: 'Account', path: '/admin/manage-account', icon: faUsers },
    { title: 'Place Type', path: '/admin/manage-place-type', icon: faMountainSun },
    { title: 'Facility', path: '/admin/manage-facility', icon: faCar },
    { title: 'Utility', path: '/admin/manage-utility', icon: faMugHot },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="bottom-right" richColors expand={true} />
      <Sidebar items={sidebarItems} />
      <div className="flex-1 p-5 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default SidebarFrame
