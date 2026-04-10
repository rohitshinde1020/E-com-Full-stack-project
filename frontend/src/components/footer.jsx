import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='relative overflow-hidden border-t mt-10 border-neutral-200 bg-neutral-950 text-neutral-100'>
      <div className='absolute -left-16 top-10 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl' />
      <div className='absolute -right-10 bottom-8 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 lg:px-10'>
        <div className='grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1fr]'>
          <div>
            <img src={assets.logo} alt='Brand logo' className='h-9 w-auto rounded bg-white px-2 py-1' />
            <p className='mt-4 max-w-sm text-sm leading-relaxed text-neutral-300'>
              Your everyday fashion destination with curated collections, secure checkout, and fast delivery.
            </p>

            <div className='mt-5 flex items-center gap-3'>
              <span className='rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-300'>
                Trusted Store
              </span>
              <span className='rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-300'>
                Since 2024
              </span>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-white'>Quick Links</h3>
            <ul className='mt-4 space-y-2.5 text-sm text-neutral-300'>
              <li><Link to='/' className='transition-colors hover:text-white'>Home</Link></li>
              <li><Link to='/collection' className='transition-colors hover:text-white'>Collection</Link></li>
              <li><Link to='/about' className='transition-colors hover:text-white'>About Us</Link></li>
              <li><Link to='/contact' className='transition-colors hover:text-white'>Contact</Link></li>
              <li><Link to='/order' className='transition-colors hover:text-white'>Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-white'>Customer Care</h3>
            <ul className='mt-4 space-y-2.5 text-sm text-neutral-300'>
              <li><Link to='/placeorder' className='transition-colors hover:text-white'>Shipping Info</Link></li>
              <li><Link to='/placeorder' className='transition-colors hover:text-white'>Returns & Refunds</Link></li>
              <li><Link to='/placeorder' className='transition-colors hover:text-white'>Payment Methods</Link></li>
              <li><Link to='/login' className='transition-colors hover:text-white'>My Account</Link></li>
              <li><Link to='/cart' className='transition-colors hover:text-white'>My Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-white'>Stay Updated</h3>
            <p className='mt-4 text-sm text-neutral-300'>Get weekly style drops, offers, and early access updates.</p>

            <form className='mt-4 flex gap-2'>
              <input
                type='email'
                placeholder='Enter email'
                className='w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-400 outline-none transition-colors focus:border-white/40'
              />
              <button
                type='submit'
                className='rounded-lg bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900 transition-all duration-300 hover:-translate-y-0.5'
              >
                Join
              </button>
            </form>

            <div className='mt-5 flex items-center gap-2'>
              <img src={assets.razorpay_logo} alt='Razorpay' className='h-5 w-auto rounded bg-white px-2 py-1' />
              <img src={assets.stripe_logo} alt='Stripe' className='h-5 w-auto rounded bg-white px-2 py-1' />
            </div>
          </div>
        </div>

        <div className='flex flex-col items-start justify-between gap-3 pt-6 text-xs text-neutral-400 sm:flex-row sm:items-center'>
          <p>Copyright {new Date().getFullYear()} Forever. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Link to='/contact' className='transition-colors hover:text-white'>Help Center</Link>
            <Link to='/about' className='transition-colors hover:text-white'>Terms</Link>
            <Link to='/about' className='transition-colors hover:text-white'>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
