import React from 'react'
import { toast } from 'react-toastify'

const supportChannels = [
  {
    title: 'Live Chat',
    detail: 'Avg. wait 45 sec',
    note: 'Best for order updates and quick fixes.',
  },
  {
    title: 'Email Support',
    detail: 'care@urbanbasket.demo',
    note: 'Ideal for return approvals and account help.',
  },
  {
    title: 'Call Center',
    detail: '+1 (800) 555-0149',
    note: 'Mon-Sat, 9:00 AM - 9:00 PM (EST).',
  },
]

const officeLocations = [
  {
    city: 'New York HQ',
    address: '241 Mercer Street, SoHo, NY 10012',
    hours: 'Mon-Fri, 9:00 AM - 7:00 PM',
  },
  {
    city: 'Los Angeles Studio',
    address: '8701 Melrose Ave, West Hollywood, CA 90069',
    hours: 'Mon-Sat, 10:00 AM - 8:00 PM',
  },
]

const faqs = [
  {
    q: 'How long does support take to respond?',
    a: 'Our demo SLA is under 2 hours for chat and under 12 hours for email.',
  },
  {
    q: 'Can I change shipping address after placing an order?',
    a: 'Yes, address changes are possible within 30 minutes of checkout confirmation.',
  },
  {
    q: 'How do I start a return?',
    a: 'Share your order ID in the form below and we will send a prepaid return label.',
  },
]

const Contact = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent successfully! We will get back to you soon.')
    e.target.reset()
  }
  return (
    <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-24 top-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-16 top-40 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl' />

      <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8 lg:p-10'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          Customer Care Portal
        </p>

        <div className='mt-5 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center'>
          <div>
            <h1 className='text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl'>
              Talk to Our
              <span className='block text-neutral-500'>E-Commerce Support Team</span>
            </h1>
            <p className='mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg'>
              Need help with an order, payment, delivery, or return? Send us a message and we will resolve it fast. All details shown here are hypothetical demo data for this project.
            </p>

            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <span className='rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white'>
                Avg. Resolution: 4h 20m
              </span>
              <span className='rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700'>
                Satisfaction: 98.4%
              </span>
            </div>
          </div>

          <div className='rounded-3xl border border-neutral-200 bg-linear-to-br from-amber-50 via-white to-sky-50 p-6 shadow-lg shadow-black/5 sm:p-7'>
            <h2 className='text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl'>
              Fast Support Channels
            </h2>
            <div className='mt-4 space-y-3'>
              {supportChannels.map((channel) => (
                <article
                  key={channel.title}
                  className='rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-neutral-800'>
                      {channel.title}
                    </h3>
                    <p className='text-sm font-medium text-neutral-700'>{channel.detail}</p>
                  </div>
                  <p className='mt-2 text-sm text-neutral-600'>{channel.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-7'>
          <div className='mb-6 flex flex-wrap items-end justify-between gap-3'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>Contact Form</p>
              <h2 className='mt-1 text-2xl font-semibold tracking-tight text-neutral-900'>Send Us a Message</h2>
            </div>
            <p className='text-sm text-neutral-600'>Ticket ID preview: UB-2026-1842</p>
          </div>

          <form onSubmit={handleFormSubmit} className='grid gap-4 sm:grid-cols-2'>
            <label className='flex flex-col gap-2 text-sm font-medium text-neutral-700'>
              Full Name
              <input
                type='text'
                defaultValue='Alex Morgan'
                className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700'
              />
            </label>

            <label className='flex flex-col gap-2 text-sm font-medium text-neutral-700'>
              Email
              <input
                type='email'
                defaultValue='alex.morgan@demo-mail.com'
                className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700'
              />
            </label>

            <label className='flex flex-col gap-2 text-sm font-medium text-neutral-700'>
              Order ID (Optional)
              <input
                type='text'
                placeholder='UB-784392'
                className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700'
              />
            </label>

            <label className='flex flex-col gap-2 text-sm font-medium text-neutral-700'>
              Topic
              <select className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 transition-colors focus:border-neutral-700'>
                <option>Delivery Delay</option>
                <option>Return Request</option>
                <option>Refund Status</option>
                <option>Product Query</option>
              </select>
            </label>

            <label className='sm:col-span-2 flex flex-col gap-2 text-sm font-medium text-neutral-700'>
              Message
              <textarea
                rows='5'
                defaultValue='Hello team, my order seems delayed by 2 days. Could you please check and share the latest tracking status?'
                className='resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none ring-0 transition-colors placeholder:text-neutral-400 focus:border-neutral-700'
              />
            </label>

            <div className='sm:col-span-2 flex flex-wrap items-center justify-between gap-3'>
              <p className='text-xs text-neutral-500'>
                By submitting, you agree to our hypothetical support policy and demo terms.
              </p>
              <button
                type='submit'
                className='rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <aside className='space-y-6'>
          <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
            <h3 className='text-lg font-semibold text-neutral-900'>Our Offices</h3>
            <div className='mt-4 space-y-3'>
              {officeLocations.map((office) => (
                <article key={office.city} className='rounded-2xl border border-neutral-200 bg-white p-4'>
                  <p className='text-sm font-semibold uppercase tracking-[0.13em] text-neutral-800'>{office.city}</p>
                  <p className='mt-2 text-sm leading-relaxed text-neutral-600'>{office.address}</p>
                  <p className='mt-1 text-xs font-medium text-neutral-500'>{office.hours}</p>
                </article>
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-neutral-200/80 bg-linear-to-b from-neutral-900 to-neutral-800 p-5 text-white shadow-lg shadow-black/15 sm:p-6'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-neutral-300'>Priority Support</p>
            <h3 className='mt-2 text-2xl font-semibold leading-tight'>Need urgent help?</h3>
            <p className='mt-2 text-sm leading-relaxed text-neutral-300'>
              For payment issues during checkout, call our priority line and mention code FASTLANE-24.
            </p>
            <p className='mt-4 text-lg font-semibold'>+1 (800) 555-0175</p>
          </div>
        </aside>
      </section>

      <section className='relative mx-auto mt-8 max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-7'>
        <div className='mb-5 flex flex-wrap items-end justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500'>Help Center</p>
            <h2 className='mt-1 text-2xl font-semibold tracking-tight text-neutral-900'>Frequently Asked Questions</h2>
          </div>
          <p className='text-sm text-neutral-600'>Updated: April 2026 (demo data)</p>
        </div>

        <div className='grid gap-3 md:grid-cols-3'>
          {faqs.map((item) => (
            <article
              key={item.q}
              className='rounded-2xl border border-neutral-200 bg-linear-to-b from-white to-neutral-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <h3 className='text-sm font-semibold leading-snug text-neutral-900'>{item.q}</h3>
              <p className='mt-2 text-sm leading-relaxed text-neutral-600'>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Contact
