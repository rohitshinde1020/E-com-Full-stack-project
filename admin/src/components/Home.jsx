import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'


const Home = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${backendUrl}/api/products/list`)
                if (response.data?.success) {
                    setProducts(response.data.products || [])
                } else {
                    toast.error(response.data?.message || 'Failed to load dashboard data.')
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Request failed while fetching dashboard data.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const stats = useMemo(() => {
        const total = products.length
        const bestsellerCount = products.filter((item) => item.bestseller).length
        const categories = new Set(products.map((item) => item.category)).size
        return [
            { title: 'Total Products', value: total },
            { title: 'Bestsellers', value: bestsellerCount },
            { title: 'Active Categories', value: categories },
        ]
    }, [products])

    return (
        <div className='space-y-6'>
            <div>
                <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600'>
                    Overview
                </p>
                <h1 className='mt-3 text-2xl font-bold text-gray-900 sm:text-3xl'>Admin Dashboard</h1>
                <p className='mt-1 text-sm text-gray-500'>Manage products, orders, and store activity from one place.</p>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {(isLoading ? [1, 2, 3] : stats).map((card, index) => (
                    <div
                        key={isLoading ? index : card.title}
                        className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
                    >
                        {isLoading ? (
                            <>
                                <div className='h-3 w-2/3 animate-pulse rounded bg-gray-200' />
                                <div className='mt-3 h-8 w-1/2 animate-pulse rounded bg-gray-200' />
                            </>
                        ) : (
                            <>
                                <p className='text-sm text-gray-500'>{card.title}</p>
                                <p className='mt-2 text-3xl font-semibold text-gray-900'>{card.value}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
                <h2 className='text-lg font-semibold text-gray-900'>Quick Notes</h2>
                <ul className='mt-3 space-y-2 text-sm text-gray-600'>
                    <li>Use Add Product to publish new catalog items with up to 4 images.</li>
                    <li>Use Product List to review and remove products from the database.</li>
                    <li>Orders page is ready for integration when backend order APIs are available.</li>
                </ul>
            </div>
        </div>

    )
}

export default Home
