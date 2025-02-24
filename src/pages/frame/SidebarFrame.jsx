import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { faUsers, faCar, faMountainSun, faMugHot, faClipboardList, faBuilding, faTools } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/Sidebar';
import { Toaster } from 'sonner';

const SidebarFrame = () => {
  const location = useLocation();

  const adminSidebarItems = [
    { title: 'Account', path: '/admin/account', icon: faUsers },
    { title: 'Place Type', path: '/admin/place-type', icon: faMountainSun },
    { title: 'Facility', path: '/admin/facility', icon: faCar },
    { title: 'Utility', path: '/admin/utility', icon: faMugHot },
  ];

  const managerSidebarItems = [
    { title: 'Dashboard', path: '/manager/dashboard', icon: faClipboardList },
    { title: 'Request', path: '/manager/request', icon: faBuilding },
    { title: 'Services', path: '/manager/services', icon: faTools },
  ];

  const sidebarItems = location.pathname.startsWith('/manager') ? managerSidebarItems : adminSidebarItems;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="bottom-right" richColors expand={true} />
      <Sidebar items={sidebarItems} />
      <div className="flex-1 p-5 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarFrame;
