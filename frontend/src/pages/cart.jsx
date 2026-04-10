import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Shopcontext } from '../context/shopcontext'
import { assets } from '../assets/assets'

const Cart = () => {
  const { cartitems, products, currency, deliveryFee, removeFromCart, backendurl, getCartTotal, setCartitems, token } = useContext(Shopcontext)

  const cartItemsList = useMemo(() => {
    const items = []
    for (const itemid in cartitems) {
      const product = products.find((p) => p._id === itemid)
      if (product) {
        for (const size in cartitems[itemid]) {
          items.push({
            itemId: itemid,
            product,
            size,
            quantity: cartitems[itemid][size],
            totalPrice: product.price * cartitems[itemid][size],
          })
        }
      }
    }
    return items
  }, [cartitems, products])

  const subtotal = getCartTotal()
  const tax = subtotal * 0.1
  const total = subtotal + tax + deliveryFee

  const updateQuantity = async (itemId, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size)
      toast.info('Item removed from cart')
      return
    }
    const cartdata = structuredClone(cartitems)
    if (cartdata[itemId] && cartdata[itemId][size]) {
      cartdata[itemId][size] = newQuantity
      setCartitems(cartdata)
      toast.success('Quantity updated')
    }

    const activeToken = token || localStorage.getItem('token') || ''

    if (activeToken) {
      // Update cart on backend
      try {
        const response = await axios.post(`${backendurl}/api/cart/update`, {
          productId: itemId,
          size,
          quantity: newQuantity
        }, {
          headers: { token: activeToken }
        })

        if (!response.data?.success) {
          toast.error(response.data?.message || 'Failed to update cart on backend')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update cart on backend')
      }
    }
  }

  if (cartItemsList.length === 0) {
    return (
      <section className='mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-10'>
        <div className='rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500'>
          Your Cart
        </div>
        <h1 className='mt-5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl'>
          Your cart is empty
        </h1>
        <p className='mt-2 max-w-md text-sm text-neutral-600 sm:text-base'>
          Add items to your cart to get started with your order.
        </p>
        <Link
          to='/collection'
          className='mt-6 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
        >
          Continue Shopping
        </Link>
      </section>
    )
  }

  return (
    <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-20 top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-16 top-40 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl' />

      <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          Shopping Cart
        </p>

        <h1 className='mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
          Your Items
        </h1>
        <p className='mt-2 text-sm text-neutral-600'>
          Review your selections below. Modify quantities or remove items as needed.
        </p>
      </section>

      <div className='relative mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]'>
        <div className='space-y-3 rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
          <div className='mb-4 hidden items-center border-b border-neutral-200 pb-4 text-sm font-semibold text-neutral-700 sm:grid sm:grid-cols-[80px_1fr_80px_120px_80px] sm:gap-4'>
            <span>Image</span>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Action</span>
          </div>

          {cartItemsList.map((item) => (
            <div
              key={`${item.itemId}-${item.size}`}
              className='grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:grid-cols-[80px_1fr_80px_120px_80px] sm:items-center sm:gap-4'
            >
              <div className='overflow-hidden rounded-lg border border-neutral-200'>
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className='h-20 w-20 object-cover'
                />
              </div>

              <div className='text-sm'>
                <p className='font-semibold text-neutral-900'>{item.product.name}</p>
                <p className='text-xs text-neutral-600'>Size: {item.size}</p>
              </div>

              <p className='text-sm font-semibold text-neutral-900'>
                {currency}
                {item.product.price.toFixed(2)}
              </p>

              <div className='inline-flex items-center rounded-lg border border-neutral-300 w-fit sm:w-auto'>
                <button
                  type='button'
                  onClick={() => updateQuantity(item.itemId, item.size, item.quantity - 1)}
                  className='px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100'
                >
                  -
                </button>
                <span className='w-8 text-center text-sm font-semibold text-neutral-900'>
                  {item.quantity}
                </span>
                <button
                  type='button'
                  onClick={() => updateQuantity(item.itemId, item.size, item.quantity + 1)}
                  className='px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100'
                >
                  +
                </button>
              </div>

              <button
                type='button'
                onClick={() => {
                  removeFromCart(item.itemId, item.size)
                  toast.warn('Item removed from cart')
                }}
                className='inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 transition-all duration-200 hover:bg-red-100'
                aria-label='Remove from cart'
              >
                <img src={assets.cross_icon} alt='Remove' className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>

        <aside className='space-y-4'>
          <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
            <h2 className='text-lg font-semibold text-neutral-900'>Order Summary</h2>

            <div className='mt-5 space-y-3 border-b border-neutral-200 pb-4 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-neutral-600'>Subtotal</span>
                <span className='font-semibold text-neutral-900'>
                  {currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-neutral-600'>Tax (10%)</span>
                <span className='font-semibold text-neutral-900'>
                  {currency}
                  {tax.toFixed(2)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-neutral-600'>Delivery Fee</span>
                <span className='font-semibold text-neutral-900'>
                  {currency}
                  {deliveryFee.toFixed(2)}
                </span>
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between'>
              <span className='text-base font-semibold text-neutral-900'>Total</span>
              <span className='text-2xl font-bold text-neutral-900'>
                {currency}
                {total.toFixed(2)}
              </span>
            </div>

            <Link
              to='/placeorder'
              className='mt-5 block w-full rounded-xl bg-neutral-900 px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
            >
              Proceed to Checkout
            </Link>

            <Link
              to='/collection'
              className='mt-3 block w-full rounded-xl border border-neutral-300 bg-white px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
            >
              Continue Shopping
            </Link>
          </div>

          <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600'>
            <p className='font-semibold text-neutral-900'>Free Shipping Over {currency}100</p>
            <p className='mt-1'>
              You save {currency}
              {(100 - deliveryFee).toFixed(2)} on delivery when you spend over {currency}100.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Cart
