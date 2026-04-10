import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App.jsx'

const statusOptions = [
  'order placed',
  'processing',
  'packed',
  'shipped',
  'out for delivery',
  'delivered',
  'cancelled',
]

const statusPillClass = (status) => {
  const normalized = String(status || '').toLowerCase()

  if (normalized === 'delivered') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }

  if (normalized === 'cancelled') {
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (normalized.includes('ship') || normalized.includes('out for delivery')) {
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return 'bg-amber-100 text-amber-700 border-amber-200'
}

const Order = ({ token }) => {
  const [allOrders, setAllOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState('')

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/orders/allorders`,
        {},
        { headers: { token } }
      )

      if (response.data?.success) {
        setAllOrders(response.data.orders || [])
        return
      }

      setAllOrders([])
      toast.error(response.data?.message || 'Unable to fetch orders.')
    } catch (error) {
      setAllOrders([])
      const message = error.response?.data?.message || 'Error fetching all orders.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  const summary = useMemo(() => {
    const total = allOrders.length
    const pending = allOrders.filter((singleOrder) => {
      const normalized = String(singleOrder.status || '').toLowerCase()
      return normalized !== 'delivered' && normalized !== 'cancelled'
    }).length
    const delivered = allOrders.filter((singleOrder) => String(singleOrder.status || '').toLowerCase() === 'delivered').length

    return { total, pending, delivered }
  }, [allOrders])

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return

    try {
      setUpdatingOrderId(orderId)

      const response = await axios.post(
        `${backendUrl}/api/orders/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      )

      if (response.data?.success) {
        setAllOrders((prevOrders) =>
          prevOrders.map((singleOrder) =>
            singleOrder._id === orderId ? { ...singleOrder, status: newStatus } : singleOrder
          )
        )
        toast.success('Order status updated.')
        return
      }

      toast.error(response.data?.message || 'Unable to update order status.')
    } catch (error) {
      const message = error.response?.data?.message || 'Error updating order status.'
      toast.error(message)
    } finally {
      setUpdatingOrderId('')
    }
  }

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600'>
            Order Manager
          </p>
          <h1 className='mt-3 text-2xl font-bold text-gray-900 sm:text-3xl'>Orders</h1>
          <p className='mt-1 text-sm text-gray-500'>
            View all customer orders and update delivery status in real-time.
          </p>
        </div>

        <button
          type='button'
          onClick={fetchAllOrders}
          className='rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50'
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Total Orders</p>
          <p className='mt-2 text-2xl font-bold text-gray-900'>{summary.total}</p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Pending / Active</p>
          <p className='mt-2 text-2xl font-bold text-gray-900'>{summary.pending}</p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Delivered</p>
          <p className='mt-2 text-2xl font-bold text-gray-900'>{summary.delivered}</p>
        </div>
      </div>

      <div className='mt-6 space-y-4'>
        {!isLoading && allOrders.length === 0 && (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center'>
            <h2 className='text-lg font-semibold text-gray-900'>No Orders Found</h2>
            <p className='mt-2 text-sm text-gray-500'>Orders will appear here once customers place them.</p>
          </div>
        )}

        {allOrders.map((singleOrder) => (
          <article
            key={singleOrder._id}
            className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5'
          >
            <div className='flex flex-col gap-4 border-b border-gray-200 pb-4 lg:flex-row lg:items-start lg:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Order ID</p>
                <p className='mt-1 break-all text-sm font-semibold text-gray-900'>{singleOrder._id}</p>
                <p className='mt-1 text-sm text-gray-500'>
                  Placed on {new Date(singleOrder.date).toLocaleString()}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusPillClass(singleOrder.status)}`}>
                  {singleOrder.status || 'order placed'}
                </span>
                <span className='rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                  {singleOrder.paymentmethod || 'N/A'}
                </span>
                <span className='rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                  {singleOrder.payment ? 'paid' : 'pending payment'}
                </span>
              </div>
            </div>

            <div className='mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]'>
              <div className='space-y-4'>
                <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Customer</p>
                  <p className='mt-1 text-sm font-semibold text-gray-900'>
                    {singleOrder.customerName || singleOrder.address?.fullName || 'Unknown Customer'}
                  </p>
                  <p className='text-sm text-gray-600'>{singleOrder.customerEmail || singleOrder.address?.email || 'N/A'}</p>
                  <p className='text-sm text-gray-600'>Phone: {singleOrder.address?.phone || 'N/A'}</p>
                </div>

                <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Delivery Address</p>
                  <p className='mt-1 text-sm text-gray-700'>
                    {singleOrder.address?.line1 || 'N/A'}, {singleOrder.address?.city || 'N/A'}, {singleOrder.address?.state || 'N/A'}, {singleOrder.address?.zip || 'N/A'}, {singleOrder.address?.country || 'N/A'}
                  </p>
                </div>

                <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Items Ordered</p>
                  <div className='mt-2 space-y-2'>
                    {Array.isArray(singleOrder.items) && singleOrder.items.length > 0 ? (
                      singleOrder.items.map((item, index) => (
                        <div
                          key={`${singleOrder._id}-${item.productId || item._id || index}`}
                          className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm'
                        >
                          <p className='font-medium text-gray-900'>
                            {item.name || 'Unnamed Product'}
                            {item.size ? ` (Size: ${item.size})` : ''}
                          </p>
                          <p className='text-gray-600'>Qty: {item.quantity || 0}</p>
                        </div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-500'>No items found in this order.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Update Status</p>
                <p className='mt-1 text-sm text-gray-500'>
                  Changing this will be visible to customer when they click Track Order.
                </p>

                <select
                  value={singleOrder.status || 'order placed'}
                  onChange={(event) => updateOrderStatus(singleOrder._id, event.target.value)}
                  className='mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                  disabled={updatingOrderId === singleOrder._id}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <div className='mt-4 rounded-lg border border-gray-200 bg-white p-3'>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Order Total</p>
                  <p className='mt-1 text-xl font-bold text-gray-900'>${Number(singleOrder.amount || 0).toFixed(2)}</p>
                </div>

                {updatingOrderId === singleOrder._id && (
                  <p className='mt-3 text-sm font-medium text-red-600'>Updating status...</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Order
