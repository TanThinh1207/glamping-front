import "./index.css";
import { Navigate } from "react-router-dom";
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';
import CustomerFrame from './pages/frame/CustomerFrame';
import HostFrame from './pages/frame/HostFrame';
import AdminFrame from './pages/frame/SidebarFrame';
import HomePage from './pages/HomePage';
import About from './pages/About';
import CampsitePage from './pages/booking-pages/CampsitePage';
import CamptypePage from './pages/booking-pages/CamptypePage';
import Account from './pages/Account';
import ExtraService from './pages/booking-pages/ExtraService';
import ManagePlaceType from './pages/admin-pages/ManagePlaceType';
import ManageAccount from './pages/admin-pages/ManageAccount';
import ManageUtility from './pages/admin-pages/ManageUtility';
import ManageFacility from './pages/admin-pages/ManageFacility';
import CreateCampsiteStepPage from './pages/host-pages/createCampsite/CreateCampsiteStepPage';
import GuestInfo from './pages/booking-pages/GuestInfo';
import TripList from './pages/TripList';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/manager-pages/Dashboard';
import HandleRequest from './pages/manager-pages/HandleRequest';
import CompleteBookingPage from './pages/CompleteBookingPage';

// Host
import { CampsiteProvider } from './context/CampsiteContext';
import Hosting from './pages/host-pages/Hosting';
import Calendar from './pages/host-pages/Calendar';
import Listings from './pages/host-pages/Listings';
import Reservations from './pages/host-pages/Reservations';
import DetailCampsite from './pages/host-pages/DetailCampsite';
import Earnings from "./pages/host-pages/Earnings";

// Reservation Subpages
import ReservationUpcoming from './pages/host-pages/reservationList/ReservationUpcoming';
import ReservationCompleted from './pages/host-pages/reservationList/ReservationCompleted';
import ReservationCanceled from './pages/host-pages/reservationList/ReservationCanceled';
import ReservationAll from './pages/host-pages/reservationList/ReservationAll';
import ReservationCheckin from './pages/host-pages/reservationList/ReservationCheckin';
import ReservationCheckout from './pages/host-pages/reservationList/ReservationCheckout';

// Campsite Editor
import EditPhoto from './pages/host-pages/editCampsite/EditPhoto';
import EditTitle from './pages/host-pages/editCampsite/EditTitle';
import EditDescription from './pages/host-pages/editCampsite/EditDescription';
import EditPlaceType from './pages/host-pages/editCampsite/EditPlaceType';
import EditAmenities from './pages/host-pages/editCampsite/EditAmenities';
import EditLocation from './pages/host-pages/editCampsite/EditLocation';
import EditService from './pages/host-pages/editCampsite/EditService';
import EditCampType from './pages/host-pages/editCampsite/EditCampType';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomerFrame />,
      errorElement: <h1>Oops! This page doesn't exist.</h1>,
      children: [
        { path: "", element: <HomePage /> },
        {
          path: "login",
          element: <LoginPage />,
          loader: () => {
            const user = localStorage.getItem("user");
            if (user) return redirect("/account");
            return null;
          }
        },
        { path: "about", element: <About /> },
        { path: "campsite", element: <CampsitePage /> },
        { path: "campsite/:campsiteId", element: <CamptypePage /> },
        { path: "campsite/:campsiteId/extra-service", element: <ExtraService /> },
        { path: "campsite/:campsiteId/guest-info", element: <GuestInfo /> },
        { path: "account", element: <Account /> },
        { path: "trip", element: <TripList /> },
        { path: "complete-booking", element: <CompleteBookingPage /> },
      ]
    },
    {
      path: "/hosting",
      element: <HostFrame />,
      children: [
        { path: "", element: <Hosting /> },
        { path: "calendar", element: <Calendar /> },
        { path: "listings", element: <Listings /> },
        { path: "earnings", element: <Earnings /> },
        {
          path: "reservations",
          element: <Reservations />,
          children: [
            { index: true, element: <ReservationUpcoming /> },
            { path: "upcoming", element: <ReservationUpcoming /> },
            { path: "completed", element: <ReservationCompleted /> },
            { path: "canceled", element: <ReservationCanceled /> },
            { path: "all", element: <ReservationAll /> },
            { path: "checking-in", element: <ReservationCheckin /> },
            { path: "checking-out", element: <ReservationCheckout /> },
          ]
        },
        { path: "create-campsite/:step", element: <CreateCampsiteStepPage /> },
        {
          path: "listings/editor/:id/details",
          element: <DetailCampsite />,
          children: [
            { index: true, element: <Navigate to="photo" replace /> },
            { path: "photo", element: <EditPhoto /> },
            { path: "title", element: <EditTitle /> },
            { path: "description", element: <EditDescription /> },
            { path: "place-type", element: <EditPlaceType /> },
            { path: "amenities", element: <EditAmenities /> },
            { path: "location", element: <EditLocation /> },
            { path: "service", element: <EditService /> },
            { path: "camp-type", element: <EditCampType /> },
          ]
        },
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
      <UserProvider>
        <BookingProvider>
          <CampsiteProvider>
            <RouterProvider router={router} />
          </CampsiteProvider>
        </BookingProvider>
      </UserProvider>
    </>
  )
}

export default App
