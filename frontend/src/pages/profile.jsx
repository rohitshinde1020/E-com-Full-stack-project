import React from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const userName = localStorage.getItem('userName') || 'Guest User'
  const userEmail = localStorage.getItem('userEmail') || 'No email saved yet'
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  const stats = [
    { label: 'Orders Placed', value: '12' },
    { label: 'Wishlist Items', value: '08' },
    { label: 'Saved Addresses', value: '02' },
  ]

  return (
    <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-20 top-16 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl' />
      <div className='absolute -right-16 top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl' />

      <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          Profile
        </p>
        <h1 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
          Your Account
        </h1>
        <p className='mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base'>
          View your account summary, contact information, and shopping activity in one place.
        </p>
      </section>

      <section className='relative mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-lg shadow-black/5 backdrop-blur-sm'>
          <div className='flex items-center gap-4 border-b border-neutral-200 pb-5'>
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-xl font-semibold text-white'>
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className='text-xl font-semibold tracking-tight text-neutral-900'>{userName}</h2>
              <p className='mt-1 text-sm text-neutral-600'>{userEmail}</p>
            </div>
          </div>

          <div className='mt-5 space-y-3 text-sm text-neutral-600'>
            <div className='flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3'>
              <span>Status</span>
              <span className='font-semibold text-neutral-900'>{isAuthenticated ? 'Active' : 'Guest'}</span>
            </div>
            <div className='flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3'>
              <span>Member Since</span>
              <span className='font-semibold text-neutral-900'>April 2026</span>
            </div>
            <div className='flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3'>
              <span>Preferred Currency</span>
              <span className='font-semibold text-neutral-900'>USD</span>
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
            <Link
              to='/collection'
              className='inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
            >
              Continue Shopping
            </Link>
            <Link
              to='/order'
              className='inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-lg shadow-black/5 backdrop-blur-sm'>
          <h2 className='text-xl font-semibold tracking-tight text-neutral-900'>Account Overview</h2>
          <p className='mt-1 text-sm text-neutral-600'>Quick summary of your account activity and saved data.</p>

          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {stats.map((item) => (
              <div key={item.label} className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>{item.label}</p>
                <p className='mt-2 text-2xl font-semibold text-neutral-900'>{item.value}</p>
              </div>
            ))}
          </div>

          <div className='mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5'>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500'>Security</h3>
            <p className='mt-2 text-sm leading-relaxed text-neutral-600'>
              You can extend this page later with editable profile fields, password update, and address management when backend user APIs are ready.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Profile
