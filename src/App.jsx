import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import CustomerFrame from './pages/frame/CustomerFrame';
import HostFrame from './pages/frame/HostFrame';
import AdminFrame from './pages/frame/SidebarFrame';
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
import { BookingProvider } from './context/BookingContext';
import GuestInfo from './pages/booking-pages/GuestInfo';
import TripList from './pages/TripList';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/manager-pages/Dashboard';
import HandleRequest from './pages/manager-pages/HandleRequest';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomerFrame />,
      errorElement: <h1>Oops! This page doesn't exist.</h1>,
      children: [
        { path: "", element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "about", element: <About /> },
        { path: "campsite", element: <CampsitePage /> },
        { path: "campsite/:campsiteId", element: <CamptypePage /> },
        { path: "campsite/:campsiteId/extra-service", element: <ExtraService /> },
        { path: "campsite/:campsiteId/guest-info", element: <GuestInfo /> },
        { path: "account", element: <Account /> },
        { path: "trip", element: <TripList /> },
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
        { path: "create-campsite/:step", element: <CreateCampsiteStepPage /> },
      ]
    },
    {
      path: "/admin",
      element: <AdminFrame />,
      children: [
        { path: "place-type", element: <ManagePlaceType /> },
        { path: "account", element: <ManageAccount /> },
        { path: "utility", element: <ManageUtility /> },
        { path: "facility", element: <ManageFacility /> },
      ]
    },
    {
      path: "/manager",
      element: <AdminFrame />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "request", element: <HandleRequest /> },
      ]
    }
  ])
  return (
    <>
      <BookingProvider>
        <RouterProvider router={router} />
      </BookingProvider>
    </>
  )
}

export default App
