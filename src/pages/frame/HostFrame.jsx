import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import CreateCampsiteFooter from '../../components/CreateCampsiteFooter';
const HostFrame = () => {
  const location = useLocation();
  const isCreatingCampsite = location.pathname.startsWith(`/hosting/create-campsite`);
  const isHosting = location.pathname === "/hosting";

  return (
    <div>
      <Toaster position='bottom-right' expand={false} />
      <NavigationBar />
      <div className="pt-[70px]">
        <Outlet />
      </div>
      {isCreatingCampsite ? <CreateCampsiteFooter /> : isHosting && <Footer />}
    </div>
  );
}

export default HostFrame