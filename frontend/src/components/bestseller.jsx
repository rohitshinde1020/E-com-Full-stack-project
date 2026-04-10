import React, { useContext } from 'react'
import { Shopcontext } from '../context/shopcontext'
import { Link } from 'react-router-dom'

const Bestseller = () => {
    const { products } = useContext(Shopcontext);

    return (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
            {products.filter((product) => product.bestseller).slice(0, 6).map((item) => (
                <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className='group rounded-2xl border border-neutral-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                >
                    <div className='overflow-hidden rounded-xl'>
                        <img
                            src={item.image[0]}
                            alt={item.name}
                            className='h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44'
                        />
                    </div>
                    <p className='mt-3 line-clamp-2 text-sm font-medium text-neutral-800'>{item.name}</p>
                    <div className='mt-2 flex items-center justify-between'>
                        <span className='text-sm font-bold text-neutral-900'>${item.price}</span>
                        <span className='text-xs uppercase tracking-[0.12em] text-neutral-500'>Shop</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Bestseller
