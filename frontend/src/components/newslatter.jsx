import React from 'react'
import { toast } from 'react-toastify'

const Newslatter = () => {
    const handlesubmit = (e) => {
        e.preventDefault()
        toast.success('Thank you for subscribing! Check your email for the 10% discount code.')
        e.target.reset()
    }

    return (
        <div className='font-sans font-semibold text-center text-neutral-700 mt-10 space-y-4'>
            <div className='text-center'>
                Subscribe now to get the latest news, updates and special offers delivered directly to your inbox.
            </div>
            <div className='flex items-center justify-center mt-4'>
                <form onSubmit={handlesubmit}>
                    <input
                        type='email'
                        placeholder='Your email address'
                        className='border border-neutral-300 bg-white py-2 px-4 outline-none  '
                        required
                    />
                    <button className='ml-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300'>
                        Subscribe
                    </button>
                </form>
            </div>
            <div>
                subscribe to our newsletter and get 10% off your first order!
            </div>
            <div>
                By subscribing, you agree to receive promotional emails from us. You can unsubscribe at any time.
            </div>
        </div>
    )
}

export default Newslatter
