import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import CustomerFrame from './pages/user-frame/CustomerFrame';
import HostFrame from './pages/host-frame/HostFrame';
import AdminFrame from './pages/admin-frame/SidebarFrame';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Hosting from './pages/Hosting';
import Calendar from './pages/Calendar';
import CampsitePage from './pages/booking-pages/CampsitePage';
import CamptypePage from './pages/booking-pages/CamptypePage';
import Account from './pages/Account';
import Listings from './pages/Listings';
import ListingEditor from './pages/ListingEditor';
import ExtraService from './pages/booking-pages/ExtraService';
import ManagePlaceType from './pages/admin-pages/ManagePlaceType';
import ManageAccount from './pages/admin-pages/ManageAccount';
import ManageUtility from './pages/admin-pages/ManageUtility';
import ManageFacility from './pages/admin-pages/ManageFacility';
import CreateCampsiteStepPage from './pages/host-pages/createCampsite/CreateCampsiteStepPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomerFrame />,
      errorElement: <h1>Oops! This page doesn't exist.</h1>,
      children: [
        { path: "", element: <HomePage /> },
        { path: "about", element: <About /> },
        { path: "campsite", element: <CampsitePage /> },
        { path: "campsite/:campsiteId", element: <CamptypePage /> },
        { path: "campsite/:campsiteId/extra-service", element: <ExtraService /> },
        { path: "account", element: <Account /> }
      ]
    },
    {
      path: "/hosting",
      element: <HostFrame />,
      children: [
        { path: "", element: <Hosting /> },
        { path: "calendar", element: <Calendar /> },
        { path: "listings", element: <Listings /> },
        { path: "editor/:id", element: <ListingEditor /> },
        // Create Campsite
        { path: "create-campsite/:id/:step", element: <CreateCampsiteStepPage /> },
      ]
    },
    {
      path: "/admin",
      element: <AdminFrame />,
      children: [
        { path: "manage-place-type", element: <ManagePlaceType /> },
        { path: "manage-account", element: <ManageAccount /> },
        { path: "manage-utility", element: <ManageUtility /> },
        { path: "manage-facility", element: <ManageFacility /> },
      ]
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
