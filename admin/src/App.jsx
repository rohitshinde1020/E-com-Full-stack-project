import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Add from './pages/add'
import List from './pages/List'
import Order from './pages/order'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  const onLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
  }

  useEffect(()  => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setToken(token)
    }
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      <ToastContainer position='top-right' autoClose={2500} newestOnTop />
      {token !== '' ? (
        <div>
          <Navbar onLogout={onLogout} />
          <div className='mx-auto flex max-w-7xl gap-0 px-0 lg:px-6'>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className='w-full flex-1 p-4 sm:p-6'>
              <button
                type='button'
                className='mb-4 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 lg:hidden'
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
              </button>

              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/products' element={<List token={token} />} />
                <Route path='/orders' element={<Order token={token} />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Login setToken={setToken} />
      )}


    </div>
  )
}

export default App
