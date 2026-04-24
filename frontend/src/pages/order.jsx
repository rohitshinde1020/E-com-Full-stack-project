import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Shopcontext } from '../context/shopcontext'

const Order = () => {
  const [orderData, setOrderData] = useState([])
  const [trackingOrderId, setTrackingOrderId] = useState('')
  const { backendurl, token, currency } = useContext(Shopcontext)

  const fetchUserOrders = async () => {
    if (!token) {
      setOrderData([])
      return []
    }

    try {
      const response = await axios.post(
        `${backendurl}/api/orders/userorders`,
        {},
        { headers: { token } }
      )

      if (response.data?.success) {
        const orders = response.data.orders || []
        setOrderData(orders)
        return orders
      }

      setOrderData([])
      return []
    } catch {
      setOrderData([])
      return []
    }
  }

  const handleTrackOrder = async (orderId) => {
    setTrackingOrderId(orderId)
    await fetchUserOrders()
    setTrackingOrderId('')
  }

  useEffect(() => {
    fetchUserOrders()
  }, [backendurl, token])


  return (
    <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-20 top-18 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl' />
      <div className='absolute -right-16 top-28 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl' />

      <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          My Orders
        </p>
        <h1 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
          Track and Manage Your Orders
        </h1>
        <p className='mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base'>
          View live status updates, payment method, delivery timeline, and order totals. Data shown here is hypothetical demo data.
        </p>
      </section>

      <section className='relative mx-auto mt-8 max-w-7xl space-y-5'>
        {orderData.length === 0 && (
          <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-8 text-center shadow-lg shadow-black/5 backdrop-blur-sm'>
            <h2 className='text-2xl font-semibold tracking-tight text-neutral-900'>No Orders Yet</h2>
            <p className='mt-2 text-sm text-neutral-600'>Place your first order to see tracking updates here.</p>
            <Link
              to='/collection'
              className='mt-5 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
            >
              Start Shopping
            </Link>
          </div>
        )}

        {orderData.map((order) => (
          <article
            key={order._id}
            className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'
          >
            <div className='flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500'>Order ID</p>
                <h2 className='mt-1 text-xl font-semibold tracking-tight text-neutral-900'>{order._id}</h2>
                <p className='mt-1 text-sm text-neutral-600'>Placed on {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white'>
                  {order.status}
                </span>
                <span className='rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700'>
                  {order.paymentmethod}
                </span>
              </div>
            </div>

            <div className='mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
              <div>
                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>Items</p>
                    <p className='mt-1 text-lg font-semibold text-neutral-900'>{Array.isArray(order.items) ? order.items.length : 0}</p>
                  </div>
                  <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>Order Total</p>
                    <p className='mt-1 text-lg font-semibold text-neutral-900'>{currency}{Number(order.amount || 0).toFixed(2)}</p>
                  </div>
                  <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>Payment</p>
                    <p className='mt-1 text-sm font-semibold text-neutral-900'>{order.payment ? 'Paid' : 'Pending'}</p>
                  </div>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>order status</p>
                    <p className='mt-1 text-sm font-semibold text-neutral-900'>{order.status}</p>
                  </div>
                </div>

                <div className='mt-4 rounded-2xl border border-neutral-200 bg-white p-4'>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500'>Delivery Address</p>
                  <p className='mt-2 text-sm text-neutral-700'>{order.address?.fullName}</p>
                  <p className='text-sm text-neutral-600'>
                    {order.address?.line1}, {order.address?.city}, {order.address?.state}, {order.address?.zip}, {order.address?.country}
                  </p>
                  <p className='text-sm text-neutral-600'>Phone: {order.address?.phone}</p>
                </div>
              </div>

              <div className='flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
                <button
                  type='button'
                  className='rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
                  onClick={() => handleTrackOrder(order._id)}
                  disabled={trackingOrderId === order._id}
                >
                  {trackingOrderId === order._id ? 'Checking...' : 'Track Order'}
                </button>
                <button
                  type='button'
                  className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
                >
                  Download Invoice
                </button>
                <Link
                  to='/contact'
                  className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Order
