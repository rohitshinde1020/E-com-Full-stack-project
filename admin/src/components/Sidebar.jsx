import React from 'react'
import { NavLink } from 'react-router-dom'
import add_icon from '../assets/add_icon.png'
import order_icon from '../assets/order_icon.png'
import parcel_icon from '../assets/parcel_icon.svg'

const navItems = [
  { to: '/', label: 'Home', icon: parcel_icon },
  { to: '/add', label: 'Add Product', icon: add_icon },
    { to: '/products', label: 'List Items', icon: parcel_icon },
  { to: '/orders', label: 'Orders', icon: order_icon },
]

const linkClassName = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-red-500 text-white shadow-lg shadow-red-200'
      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
  }`

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && (
                <button
                    type='button'
                    className='fixed inset-0 z-30 bg-black/40 lg:hidden'
                    aria-label='Close sidebar'
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed left-0 top-[88px] z-40 h-[calc(100vh-88px)] w-72 border-r border-gray-200 bg-white px-4 py-5 shadow-xl transition-transform duration-300 lg:static lg:top-0 lg:h-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <p className='mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400'>
                    Admin Menu
                </p>

                <nav className='space-y-2'>
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={linkClassName} onClick={onClose} end={item.to === '/'}>
                            <img
                                src={item.icon}
                                alt={item.label}
                                className='h-5 w-5 rounded-md bg-white/30 p-0.5'
                            />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
