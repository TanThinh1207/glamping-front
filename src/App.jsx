import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css";
import CustomerFrame from './pages/user-frame/CustomerFrame';
import HomePage from './pages/HomePage';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <CustomerFrame/>,
      children: [
        {path: "", element: <HomePage/>},
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
