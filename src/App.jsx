import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import CustomerFrame from './pages/user-frame/CustomerFrame';
import HostFrame from './pages/host-frame/HostFrame';
import AdminFrame from './pages/admin-frame/SidebarFrame';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Hosting from './pages/Hosting';
import Calendar from './pages/Calendar';
import Glamping from './pages/Glamping';
import Dashboard from './pages/Dashboard';
import Campsite from './pages/Campsite';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <CustomerFrame/>,
      errorElement: <h1>Oops! This page doesn't exist.</h1>,
      children: [
        {path: "", element: <HomePage/>},
        {path: "about", element: <About/>},
        {path: "glamping", element: <Glamping/>},
        {path: "glamping/:location", element: <Campsite/>}
      ]
    },
    {
      path: "/hosting", 
      element: <HostFrame/>,
      children: [
        { path: "", element: <Hosting/> },
        { path: "calendar", element: <Calendar/> },
      ]
    },
    {
      path: "/admin",
      element: <AdminFrame/>,
      children: [
        { path: "dashboard", element: <Dashboard/> }
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
