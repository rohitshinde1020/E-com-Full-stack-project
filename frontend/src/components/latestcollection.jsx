import React, { useContext, useMemo } from 'react'
import { Shopcontext } from '../context/shopcontext'
import { Link } from 'react-router-dom'

const Latestcollection = ({
    title = 'Latest Collection',
    subtitle = 'Fresh arrivals curated for your everyday fit.',
    showViewAll = false,
    limit,
    className = ''
}) => {

    const { products, currency } = useContext(Shopcontext)

    const visibleProducts = useMemo(() => {
        const sortedProducts = [...products].sort((a, b) => b.date - a.date)
        return limit ? sortedProducts.slice(0, limit) : sortedProducts
    }, [products, limit])


    return (
        <div className={`relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/90 p-5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-6 ${className}`}>
            <div className='mb-5 flex items-end justify-between gap-4'>
                <div>
                    <h2 className='text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl'>
                        {title}
                    </h2>
                    <p className='mt-1 text-sm text-neutral-600 sm:text-base'>{subtitle}</p>
                </div>

                {showViewAll && (
                    <Link to='/collection' className='text-sm font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-neutral-900'>
                        View All
                    </Link>
                )}
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4'>
                {visibleProducts.map((item) => (
                    <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        className='group rounded-2xl border border-neutral-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl'
                    >
                        <div className='overflow-hidden rounded-xl'>
                            <img
                                src={item.image[0]}
                                alt={item.name}
                                className='h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44'
                            />
                        </div>
                        <p className='mt-3 line-clamp-2 text-sm font-medium text-neutral-800 sm:text-base'>
                            {item.name}
                        </p>
                        <div className='mt-2 flex items-center justify-between'>
                            <span className='text-sm font-bold text-neutral-900'>
                                {currency}
                                {item.price.toFixed(2)}
                            </span>
                            <span className='text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 transition-colors group-hover:text-neutral-900'>
                                View
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Latestcollection
