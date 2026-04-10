import React from 'react'
import logo from '../assets/logo.png'


const Navbar = ({ onLogout }) => {
  return (
    <header className='w-full border-b border-gray-200 bg-white/90 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6'>
        <img className='h-11 w-auto sm:h-10' src={logo} alt='Logo' />
        <button
          onClick={onLogout}
          className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white 
        transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'>
        
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
