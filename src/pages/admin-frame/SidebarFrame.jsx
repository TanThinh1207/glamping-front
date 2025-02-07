import React from 'react'
import { Outlet } from 'react-router-dom';
import { faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/SideBar';
import { Toaster } from 'sonner';

const SidebarFrame = () => {
  const sidebarItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: faChartLine },
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
