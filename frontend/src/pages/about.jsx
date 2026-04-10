import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const milestones = [
  { value: '250K+', label: 'Orders Delivered' },
  { value: '98%', label: 'Positive Reviews' },
  { value: '48h', label: 'Average Dispatch' },
]

const values = [
  {
    title: 'Curated Quality',
    text: 'Every item is reviewed for fit, fabric, and finish so customers get dependable style, not guesswork.',
  },
  {
    title: 'Fast Fulfillment',
    text: 'We keep shipping simple with clear tracking, quick packing, and responsive support from checkout to delivery.',
  },
  {
    title: 'Everyday Value',
    text: 'Our hypothetical brand focuses on premium-looking pieces at accessible prices for daily wear and special moments.',
  },
]

const highlights = [
  'Seasonal collections built around real-world wardrobes',
  'Easy returns and transparent customer care',
  'Mobile-first shopping experience with clean product discovery',
]

const About = () => {
  return (
    <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-20 top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-16 top-36 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl' />

      <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8 lg:p-10'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          About Our Brand
        </p>

        <div className='mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
          <div>
            <h1 className='text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl'>
              Built for Style,
              <span className='block text-neutral-500'>Designed for Everyday Living</span>
            </h1>

            <p className='mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg'>
              We are a hypothetical e-commerce brand built around a simple idea: make modern fashion feel easy, polished,
              and accessible. From new arrivals to everyday essentials, we focus on pieces that work hard in real wardrobes.
            </p>

            <div className='mt-6 flex flex-wrap gap-3'>
              <Link
                to='/collection'
                className='rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
              >
                Shop Collection
              </Link>
              <Link
                to='/contact'
                className='rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
              >
                Contact Us
              </Link>
            </div>

            <ul className='mt-6 space-y-3 text-sm text-neutral-600'>
              {highlights.map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-1.5 h-2.5 w-2.5 rounded-full bg-neutral-900' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='relative overflow-hidden rounded-3xl border border-neutral-200 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-700 p-5 text-white shadow-lg shadow-black/10 sm:p-6'>
            <img
              src={assets.hero_img}
              alt='Fashion brand showcase'
              className='h-72 w-full rounded-2xl object-cover opacity-90 shadow-2xl shadow-black/20 sm:h-84'
            />

            <div className='mt-4 grid gap-3 sm:grid-cols-3'>
              {milestones.map((item) => (
                <div key={item.label} className='rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'>
                  <p className='text-2xl font-semibold'>{item.value}</p>
                  <p className='mt-1 text-xs uppercase tracking-[0.14em] text-neutral-300'>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-3'>
        {values.map((item) => (
          <article
            key={item.title}
            className='rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
          >
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>What We Stand For</p>
            <h2 className='mt-2 text-xl font-semibold tracking-tight text-neutral-900'>{item.title}</h2>
            <p className='mt-3 text-sm leading-relaxed text-neutral-600'>{item.text}</p>
          </article>
        ))}
      </section>

      <section className='relative mx-auto mt-8 max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8'>
        <div className='grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>Our Story</p>
            <h2 className='mt-2 text-3xl font-semibold tracking-tight text-neutral-900'>
              From concept store to customer-first brand
            </h2>
            <p className='mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base'>
              The goal behind this demo storefront is to feel premium without feeling cold. We combine bold visuals,
              easy navigation, and practical support details so shoppers can move confidently from discovery to checkout.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-5'>
              <p className='text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500'>Design Approach</p>
              <p className='mt-2 text-sm leading-relaxed text-neutral-700'>
                Clean layouts, expressive hero sections, and soft gradients keep the shopping journey elevated and modern.
              </p>
            </div>
            <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-5'>
              <p className='text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500'>Customer Care</p>
              <p className='mt-2 text-sm leading-relaxed text-neutral-700'>
                We prioritize fast support, transparent policies, and helpful guidance for orders, returns, and account help.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
