import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import CustomerFrame from './pages/user-frame/CustomerFrame';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Hosting from './pages/Hosting';
import HostFrame from './pages/host-frame/HostFrame';
import Calendar from './pages/Calendar';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <CustomerFrame/>,
      children: [
        {path: "", element: <HomePage/>},
        {path: "/about", element: <About/>},
      ]
    },
    {
      path: "/hosting", 
      element: <HostFrame/>,
      children: [
        { path: "", element: <Hosting/> },
        { path: "calendar", element: <Calendar/> },
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
