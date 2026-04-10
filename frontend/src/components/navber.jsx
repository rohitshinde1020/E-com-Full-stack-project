import React, { useContext, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Shopcontext } from '../context/shopcontext'
import { toast } from 'react-toastify'

const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Collection', path: '/collection' },
    { label: 'Contact', path: '/contact' }
]

const Navbar = () => {
    
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const { setIsSearchVisible, cartitems, setCartitems, setToken } = useContext(Shopcontext)

    const cartCount = useMemo(() => {
        let count = 0
        for (const itemid in cartitems) {
            for (const size in cartitems[itemid]) {
                count += cartitems[itemid][size]
            }
        }
        return count
    }, [cartitems])

    const navLinkClass = ({ isActive }) =>
        `group relative px-2 py-1 text-sm uppercase tracking-[0.16em] transition-all duration-300 ${isActive ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
        }`

    const navigate=useNavigate();

    return (
        <header className='sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm'>
            <div className='mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10'>
                <Link to='/' className='shrink-0 transition-transform duration-300 hover:scale-[1.03]'>
                    <img src={assets.logo} alt='Logo' className='h-8 w-auto sm:h-9' />
                </Link>

                <nav className='hidden items-center gap-6 md:flex'>
                    {navItems.map((item) => (
                        <NavLink key={item.path} to={item.path} className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    {item.label}
                                    <span
                                        className={`absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-neutral-900 transition-all duration-300 ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className='flex items-center gap-3 sm:gap-4'>
                    <button
                        type='button'
                        onClick={() => setIsSearchVisible((prev) => !prev)}
                        className='rounded-full border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-200 hover:bg-neutral-100/80'
                        aria-label='Search products'
                    >
                        <img src={assets.search_icon} alt='Search' className='h-5 w-5' />
                    </button>

                    <div className='group relative hidden sm:block'>
                        <button
                            type='button'
                            className='rounded-full border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-200 hover:bg-neutral-100/80'
                            aria-label='Account menu'
                        >
                            <img src={assets.profile_icon} alt='Profile' className='h-5 w-5' />
                        </button>

                        <div className='invisible absolute right-0 top-12 min-w-36 origin-top-right rounded-xl border border-neutral-200 bg-white p-2 text-sm text-neutral-600 opacity-0 shadow-lg shadow-black/5 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                            <p className='cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900' onClick={() => navigate('/profile')}>
                                Profile
                            </p>
                            <p className='cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900' onClick={() => navigate('/order')}>
                                Orders
                            </p>
                            <p className='cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-neutral-100 hover:text-neutral-900' onClick={() => {
                                localStorage.removeItem('token');
                                toast.success('Logged out successfully');
                                setToken('');
                                setCartitems({});
                                window.location.href = '/';

                            }}>
                                Logout
                            </p>
                        </div>
                    </div>

                    <Link
                        to='/cart'
                        className='group relative rounded-full border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-200 hover:bg-neutral-100/80'
                    >
                        <img src={assets.cart_icon} alt='Cart' className='h-5 w-5' />
                        <p className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium leading-none text-white transition-transform duration-300 group-hover:scale-110'>
                            {cartCount}
                        </p>
                    </Link>

                    <button
                        type='button'
                        onClick={() => setShowMobileMenu(true)}
                        className='rounded-full border border-transparent p-2 transition-all duration-300 hover:border-neutral-200 hover:bg-neutral-100 md:hidden'
                        aria-label='Open menu'
                    >
                        <img src={assets.menu_icon} alt='Menu' className='h-5 w-5' />
                    </button>
                </div>
            </div>

            <div
                className={`fixed inset-0 z-50 bg-linear-to-br from-amber-100/25 via-sky-100/20 to-emerald-100/25 backdrop-blur-[3px] transition-all duration-300 md:hidden ${showMobileMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}
                onClick={() => setShowMobileMenu(false)}>
                <aside
                    className={`absolute right-0 top-0 h-full w-[62%] max-w-sm border-l border-white/60 bg-white/70 p-6 shadow-2xl shadow-neutral-900/20 backdrop-blur-xl transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(event) => event.stopPropagation()}>
                    <div className='mb-8 flex items-center justify-between'>
                        <img src={assets.logo} alt='Logo' className='h-8 w-auto' />
                        <button
                            type='button'
                            className='rounded-full border border-neutral-200 p-2 transition-colors hover:bg-neutral-100'
                            onClick={() => setShowMobileMenu(false)}
                            aria-label='Close menu'
                        >
                            <img src={assets.cross_icon} alt='Close' className='h-4 w-4' />
                        </button>
                    </div>

                    <nav className='flex flex-col gap-3'>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-sm uppercase tracking-[0.16em] transition-all duration-200 ${isActive
                                        ? 'bg-neutral-900 text-white'
                                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className='mt-8 border-t border-neutral-200 pt-6'>
                        <p className='text-xs text-neutral-600'>
                            {localStorage.getItem('userName') ? `Logged in as ${localStorage.getItem('userName')}` : 'Not signed in'}
                        </p>
                    </div>
                </aside>
            </div>
        </header>
    )
}

export default Navbar
