import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const List = ({ token }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${backendUrl}/api/products/list`)

        if (response.data?.success) {
          setProducts(response.data.products || [])
        } else {
          toast.error(response.data?.message || 'Failed to load products.')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Request failed while fetching products.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const onRemoveProduct = async (productId) => {
    if (!token) {
      toast.error('Admin token missing. Please login again.')
      return
    }

    const shouldDelete = window.confirm('Remove this product from database?')
    if (!shouldDelete) return

    try {
      setRemovingId(productId)

      const response = await axios.post(
        `${backendUrl}/api/products/remove`,
        { id: productId },
        {
          headers: { token },
        },
      )

      if (response.data?.success) {
        setProducts((prev) => prev.filter((item) => item._id !== productId))
        toast.success(response.data.message || 'Product removed successfully!')
      } else {
        toast.error(response.data?.message || 'Failed to remove product.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed while removing product.')
    } finally {
      setRemovingId('')
    }
  }

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600'>
            Inventory Overview
          </p>
          <h1 className='mt-3 text-2xl font-bold text-gray-900 sm:text-3xl'>Product List</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Complete information for all products currently stored in the backend.
          </p>
        </div>

        <div className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600'>
          Total Products: <span className='font-semibold text-gray-900'>{products.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='animate-pulse rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:flex sm:items-center sm:gap-4'
            >
              <div className='h-24 rounded-xl bg-gray-200 sm:h-28 sm:w-36' />
              <div className='mt-3 space-y-2 sm:mt-0 sm:flex-1'>
                <div className='h-3 w-2/3 rounded bg-gray-200' />
                <div className='h-2.5 w-full rounded bg-gray-200' />
                <div className='h-2.5 w-5/6 rounded bg-gray-200' />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className='rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center'>
          <h2 className='text-lg font-semibold text-gray-900'>No products found</h2>
          <p className='mt-2 text-sm text-gray-500'>
            Add products from the Add Product page and they will appear here.
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {products.map((product) => (
            <article
              key={product._id}
              className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-red-200 hover:shadow-md sm:flex'
            >
              <div className='bg-gray-50 p-2 sm:w-40 sm:p-3'>
                <img
                  src={product.image?.[0] || ''}
                  alt={product.name}
                  className='h-28 w-full rounded-xl object-cover sm:h-full sm:min-h-28'
                />
              </div>

              <div className='space-y-3 p-3.5 sm:flex-1'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h2 className='line-clamp-1 text-base font-bold text-gray-900'>{product.name}</h2>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        product.bestseller
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.bestseller ? 'Bestseller' : 'Regular'}
                    </span>
                    <button
                      type='button'
                      onClick={() => onRemoveProduct(product._id)}
                      disabled={removingId === product._id}
                      className='rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      {removingId === product._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div className='rounded-xl bg-gray-50 p-2.5'>
                    <p className='text-xs uppercase tracking-wide text-gray-400'>Price</p>
                    <p className='mt-0.5 font-semibold text-gray-900'>${product.price}</p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-2.5'>
                    <p className='text-xs uppercase tracking-wide text-gray-400'>Category</p>
                    <p className='mt-0.5 font-semibold text-gray-900'>{product.category}</p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-2.5'>
                    <p className='text-xs uppercase tracking-wide text-gray-400'>Sub Category</p>
                    <p className='mt-0.5 font-semibold text-gray-900'>{product.subCategory}</p>
                  </div>
                  <div className='rounded-xl bg-gray-50 p-2.5'>
                    <p className='text-xs uppercase tracking-wide text-gray-400'>Date</p>
                    <p className='mt-0.5 font-semibold text-gray-900'>
                      {product.date ? new Date(product.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Description</p>
                  <p className='mt-1.5 line-clamp-3 text-xs leading-5 text-gray-600'>
                    {product.description}
                  </p>
                </div>

                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Sizes</p>
                  <div className='mt-1.5 flex flex-wrap gap-1.5'>
                    {(product.sizes || []).map((size) => (
                      <span
                        key={`${product._id}-size-${size}`}
                        className='rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600'
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default List
