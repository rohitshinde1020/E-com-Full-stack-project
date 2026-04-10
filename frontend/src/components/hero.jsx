import React from 'react'
import { Link } from 'react-router-dom'
import { assets, products } from '../assets/assets'
import Bestseller from './bestseller'
import Latestcollection from './latestcollection'

const Hero = () => {


  return (
    <section className='relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-16 top-8 h-44 w-44 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-10 top-28 h-56 w-56 rounded-full bg-blue-300/35 blur-3xl' />

      <div className='relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]'>
        <div className='rounded-3xl border border-neutral-200/80 bg-white/80 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8 lg:p-10'>
          <p className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600'>
            New Season Drop
          </p>

          <h1 className='mt-5 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl'>
            Wear Your Identity.
          </h1>

          <p className='mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg'>
            Discover everyday luxury essentials, statement silhouettes, and timeless street-ready fits built for confidence. Crafted for comfort, designed to stand out.
          </p>

          <div className='mt-7 flex flex-wrap items-center gap-3'>
            <Link
              to='/collection'
              className='group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
            >
              Shop Now
              <span className='transition-transform duration-300 group-hover:translate-x-1'>→</span>
            </Link>

            <Link
              to='/about'
              className='inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-800'
            >
              Our Story
            </Link>
          </div>

          <div className='mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='rounded-2xl border border-neutral-200 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
              <p className='text-2xl font-bold text-neutral-900'>5k+</p>
              <p className='text-sm text-neutral-600'>Happy Shoppers</p>
            </div>
            <div className='rounded-2xl border border-neutral-200 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
              <p className='text-2xl font-bold text-neutral-900'>120+</p>
              <p className='text-sm text-neutral-600'>New Weekly Styles</p>
            </div>
            <div className='rounded-2xl border border-neutral-200 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
              <p className='text-2xl font-bold text-neutral-900'>48h</p>
              <p className='text-sm text-neutral-600'>Express Delivery</p>
            </div>
          </div>
        </div>

        <div className='relative rounded-3xl border border-neutral-200/80 bg-linear-to-b from-blue-50/70 to-white p-5 shadow-xl shadow-black/5 sm:p-7'>
          <img
            src={assets.hero_img}
            alt='Model showcasing latest fashion collection'
            className='h-full max-h-117.5 w-full rounded-2xl object-cover'
          />

          <div className='absolute bottom-9 left-9 max-w-55 rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur-md'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500'>Best Seller</p>
            <p className='mt-1 text-lg font-semibold text-neutral-900'>Signature Everyday Tee</p>
            <p className='mt-1 text-sm text-neutral-600'>Soft cotton, premium fit, all-day comfort.</p>
          </div>
        </div>
      </div>

      <div className='relative mx-auto mt-8 max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/80 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl'>Our Best Sellers</h2>
          <Link to='/collection' className='text-sm font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-neutral-900'>
            View All
          </Link>
        </div>
        <Bestseller />


      </div>

      <Latestcollection
        title='Latest Arrivals'
        subtitle='Fresh new styles just dropped. Shop the newest pieces now.'
        limit={8}
        className='mt-8'
      />
    </section>
  )
}

export default Hero
