import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Shopcontext } from '../context/shopcontext'

const Placeorder = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { cartitems, products, currency, token, deliveryFee, getCartTotal, setCartitems, backendurl } = useContext(Shopcontext)

    const [paymentMethod, setPaymentMethod] = useState('cod')
    const [deliveryDetails, setDeliveryDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    })

    const cartLineItems = useMemo(() => {
        const list = []
        for (const itemid in cartitems) {
            const item = products.find((product) => product._id === itemid)
            if (!item) continue

            for (const size in cartitems[itemid]) {
                const qty = cartitems[itemid][size]
                list.push({
                    itemId: itemid,
                    size,
                    quantity: qty,
                    item,
                    lineTotal: item.price * qty,
                })
            }
        }
        return list
    }, [cartitems, products])

    const subtotal = getCartTotal()
    const tax = subtotal * 0.1
    const total = subtotal + tax + deliveryFee

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setDeliveryDetails((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const stripeSuccess = params.get('stripe_success')
        const sessionId = params.get('session_id')
        const orderId = params.get('orderId')
        const stripeCanceled = params.get('stripe_canceled')

        if (stripeCanceled === '1') {
            toast.info('Stripe payment was canceled.')
            navigate('/cart', { replace: true })
            return
        }

        if (stripeSuccess === '1' && sessionId && orderId && token) {
            const verifyStripe = async () => {
                try {
                    const response = await axios.post(
                        `${backendurl}/api/orders/verifystripe`,
                        { orderId, sessionId },
                        { headers: { token } }
                    )

                    if (!response.data?.success) {
                        toast.error(response.data?.message || 'Stripe payment verification failed.')
                        return
                    }

                    setCartitems({})
                    toast.success('Stripe payment verified and order placed successfully!')
                    navigate('/order', { replace: true })
                } catch (error) {
                    const message = error.response?.data?.message || 'Stripe verification failed.'
                    toast.error(message)
                }
            }

            verifyStripe()
        }
    }, [backendurl, location.search, navigate, setCartitems, token])

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

    const handlePlaceOrder = async (event) => {
        event.preventDefault()

        if (cartLineItems.length === 0) {
            toast.error('Your cart is empty. Add products before placing an order.')
            return
        }

        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zip', 'country']
        const hasMissingField = requiredFields.some((field) => !deliveryDetails[field].trim())

        if (hasMissingField) {
            toast.error('Please complete all required delivery details.')
            return
        }

        if (!token) {
            toast.error('Please login to place your order.')
            navigate('/login')
            return
        }

        const orderItems = cartLineItems.map((line) => ({
            productId: line.itemId,
            name: line.item.name,
            size: line.size,
            quantity: line.quantity,
            price: line.item.price,
            image: line.item.image?.[0] || '',
        }))

        const orderPayload = {
            items: orderItems,
            amount: Number(total.toFixed(2)),
            address: {
                fullName: `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
                line1: deliveryDetails.address,
                city: deliveryDetails.city,
                state: deliveryDetails.state,
                zip: deliveryDetails.zip,
                country: deliveryDetails.country,
                phone: deliveryDetails.phone,
                email: deliveryDetails.email,
            },
            paymentmethod: paymentMethod,
            payment: paymentMethod !== 'cod',
            status: 'order placed',
            date: Date.now(),
        }

        const endpointMap = {
            cod: '/api/orders/placecod',
            stripe: '/api/orders/placestripe',
            razorpay: '/api/orders/placerazorpay',
        }

        const endpoint = endpointMap[paymentMethod]

        if (!endpoint) {
            toast.error('Unsupported payment method selected.')
            return
        }

        try {
            const response = await axios.post(`${backendurl}${endpoint}`, orderPayload, {
                headers: { token },
            })

            if (response.data?.success === false) {
                toast.error(response.data?.message || 'Unable to place order.')
                return
            }

            if (paymentMethod === 'cod') {
                setCartitems({})
                toast.success(response.data?.message || 'Order placed successfully via COD!')
                navigate('/order')
                return
            }

            if (paymentMethod === 'stripe') {
                const sessionUrl = response.data?.sessionUrl

                if (!sessionUrl) {
                    toast.error('Stripe session was not created properly.')
                    return
                }

                window.location.href = sessionUrl
                return
            }

            if (paymentMethod === 'razorpay') {
                const scriptLoaded = await loadRazorpayScript()
                if (!scriptLoaded) {
                    toast.error('Unable to load Razorpay SDK.')
                    return
                }

                const razorpayOrder = response.data?.razorpayOrder
                const orderId = response.data?.order?._id
                const razorpayKey = response.data?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID

                if (!razorpayOrder?.id || !orderId || !razorpayKey) {
                    toast.error('Razorpay order init failed.')
                    return
                }

                const options = {
                    key: razorpayKey,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: 'Urban Basket',
                    description: `Order ${orderId}`,
                    order_id: razorpayOrder.id,
                    handler: async function (rzpResponse) {
                        try {
                            const verifyResponse = await axios.post(
                                `${backendurl}/api/orders/verifyrazorpay`,
                                {
                                    orderId,
                                    razorpay_order_id: rzpResponse.razorpay_order_id,
                                    razorpay_payment_id: rzpResponse.razorpay_payment_id,
                                    razorpay_signature: rzpResponse.razorpay_signature,
                                },
                                { headers: { token } }
                            )

                            if (!verifyResponse.data?.success) {
                                toast.error(verifyResponse.data?.message || 'Razorpay verification failed.')
                                return
                            }

                            setCartitems({})
                            toast.success('Razorpay payment verified and order placed successfully!')
                            navigate('/order')
                        } catch (verifyError) {
                            const message = verifyError.response?.data?.message || 'Razorpay verification failed.'
                            toast.error(message)
                        }
                    },
                    prefill: {
                        name: `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
                        email: deliveryDetails.email,
                        contact: deliveryDetails.phone,
                    },
                    notes: {
                        address: `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state}, ${deliveryDetails.zip}, ${deliveryDetails.country}`,
                    },
                    theme: {
                        color: '#171717',
                    },
                }

                const rzp = new window.Razorpay(options)
                rzp.on('payment.failed', () => {
                    toast.error('Razorpay payment failed or canceled.')
                })
                rzp.open()
                return
            }

            toast.success(response.data?.message || `Order placed successfully via ${paymentMethod.toUpperCase()}!`)
        } catch (error) {
            const message = error.response?.data?.message || 'Order placement failed. Please try again.'
            toast.error(message)
        }
    }

    if (cartLineItems.length === 0) {
        return (
            <section className='mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-10'>
                <p className='rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500'>
                    Checkout
                </p>
                <h1 className='mt-5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl'>
                    No items ready for checkout
                </h1>
                <p className='mt-2 max-w-md text-sm text-neutral-600 sm:text-base'>
                    Add some products to your cart and come back to place the order.
                </p>
                <Link
                    to='/collection'
                    className='mt-6 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
                >
                    Browse Collection
                </Link>
            </section>
        )
    }

    return (
        <main className='relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 lg:px-10'>
            <div className='absolute -left-20 top-20 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl' />
            <div className='absolute -right-18 top-34 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl' />

            <section className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8'>
                <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
                    Secure Checkout
                </p>
                <h1 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl'>
                    Place Your Order
                </h1>
                <p className='mt-2 text-sm text-neutral-600 sm:text-base'>
                    Complete delivery details, choose payment method, and confirm your order.
                </p>
            </section>

            <form onSubmit={handlePlaceOrder} className='relative mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]'>
                <section className='space-y-6'>
                    <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
                        <h2 className='text-xl font-semibold tracking-tight text-neutral-900'>Delivery Information</h2>

                        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                            <input name='firstName' value={deliveryDetails.firstName} onChange={handleInputChange} placeholder='First Name' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                            <input name='lastName' value={deliveryDetails.lastName} onChange={handleInputChange} placeholder='Last Name' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                            <input name='email' type='email' value={deliveryDetails.email} onChange={handleInputChange} placeholder='Email Address' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900 sm:col-span-2' />
                            <input name='phone' value={deliveryDetails.phone} onChange={handleInputChange} placeholder='Phone Number' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900 sm:col-span-2' />
                            <input name='address' value={deliveryDetails.address} onChange={handleInputChange} placeholder='Street Address' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900 sm:col-span-2' />
                            <input name='city' value={deliveryDetails.city} onChange={handleInputChange} placeholder='City' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                            <input name='state' value={deliveryDetails.state} onChange={handleInputChange} placeholder='State' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                            <input name='zip' value={deliveryDetails.zip} onChange={handleInputChange} placeholder='ZIP Code' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                            <input name='country' value={deliveryDetails.country} onChange={handleInputChange} placeholder='Country' className='rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-900' />
                        </div>
                    </div>

                    <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
                        <h2 className='text-xl font-semibold tracking-tight text-neutral-900'>Payment Method</h2>
                        <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                            <button
                                type='button'
                                onClick={() => setPaymentMethod('cod')}
                                className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600'}`}
                            >
                                Cash on Delivery
                            </button>
                            <button
                                type='button'
                                onClick={() => setPaymentMethod('stripe')}
                                className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${paymentMethod === 'stripe' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600'}`}
                            >
                                Stripe
                            </button>
                            <button
                                type='button'
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all ${paymentMethod === 'razorpay' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600'}`}
                            >
                                Razorpay
                            </button>
                        </div>
                    </div>
                </section>

                <aside className='space-y-5'>
                    <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
                        <h3 className='text-lg font-semibold text-neutral-900'>Order Items</h3>
                        <div className='mt-4 space-y-3'>
                            {cartLineItems.map((line) => (
                                <article key={`${line.itemId}-${line.size}`} className='flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-3'>
                                    <img src={line.item.image[0]} alt={line.item.name} className='h-16 w-16 rounded-lg border border-neutral-200 object-cover' />
                                    <div className='min-w-0 flex-1'>
                                        <p className='truncate text-sm font-semibold text-neutral-900'>{line.item.name}</p>
                                        <p className='mt-0.5 text-xs text-neutral-500'>Size: {line.size} | Qty: {line.quantity}</p>
                                        <p className='mt-1 text-sm font-semibold text-neutral-900'>{currency}{line.lineTotal.toFixed(2)}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className='rounded-3xl border border-neutral-200/80 bg-white/85 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6'>
                        <h3 className='text-lg font-semibold text-neutral-900'>Order Summary</h3>
                        <div className='mt-4 space-y-3 border-b border-neutral-200 pb-4 text-sm'>
                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-600'>Subtotal</span>
                                <span className='font-semibold text-neutral-900'>{currency}{subtotal.toFixed(2)}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-600'>Tax (10%)</span>
                                <span className='font-semibold text-neutral-900'>{currency}{tax.toFixed(2)}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-600'>Delivery</span>
                                <span className='font-semibold text-neutral-900'>{currency}{deliveryFee.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                            <p className='text-base font-semibold text-neutral-900'>Total</p>
                            <p className='text-2xl font-bold text-neutral-900'>{currency}{total.toFixed(2)}</p>
                        </div>

                        <button
                            type='submit'
                            className='mt-5 w-full rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
                        >
                            Confirm & Place Order
                        </button>

                        <Link
                            to='/cart'
                            className='mt-3 block w-full rounded-xl border border-neutral-300 bg-white px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.13em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
                        >
                            Back to Cart
                        </Link>
                    </div>
                </aside>
            </form>
        </main>
    )
}

export default Placeorder
