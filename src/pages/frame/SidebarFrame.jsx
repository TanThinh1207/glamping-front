import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { faUsers, faCar, faMountainSun, faMugHot, faBuilding, faChartPie } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../components/Sidebar";
import { Toaster } from "sonner";
import { useUser } from "../../context/UserContext";

const SidebarFrame = () => {
  const location = useLocation();
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "user") {
    return <Navigate to="/" replace />;
  }

  const adminSidebarItems = [
    { title: "Account", path: "/admin/account", icon: faUsers },
    { title: "Place Type", path: "/admin/place-type", icon: faMountainSun },
    { title: "Facility", path: "/admin/facility", icon: faCar },
    { title: "Utility", path: "/admin/utility", icon: faMugHot },
  ];

  const managerSidebarItems = [
    { title: 'Dashboard', path: '/manager/dashboard', icon: faChartPie },
    { title: 'Request', path: '/manager/request', icon: faBuilding },
    { title: 'Campsites', path: '/manager/campsites', icon: faMountainSun },
  ];

  let sidebarItems = [];
  if (user.role === "ROLE_ADMIN" && location.pathname.startsWith("/admin")) {
    sidebarItems = adminSidebarItems;
  } else if (user.role === "ROLE_MANAGER" && location.pathname.startsWith("/manager")) {
    sidebarItems = managerSidebarItems;
  } else {
    return <Navigate to="/" replace />;
  }

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
