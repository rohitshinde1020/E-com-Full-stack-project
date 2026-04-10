import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { Shopcontext } from '../context/shopcontext'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, deliveryFee,addtocart } = useContext(Shopcontext)

  const product = useMemo(
    () => products.find((item) => item._id === productId),
    [products, productId]
  )

  const relatedProducts = useMemo(() => {
    if (!product) return []

    return products
      .filter(
        (item) =>
          item._id !== product._id &&
          (item.category === product.category ||
            item.subCategory === product.subCategory)
      )
      .slice(0, 4)
  }, [products, product])

  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size first')
      return
    }

    const result = await addtocart(productId, selectedSize)

    if (result?.success) {
      toast.success(result.message || 'Added to cart!')
      return
    }

    toast.error(result?.message || 'Failed to add item to cart')
  }

  useEffect(() => {
    if (!product) return
    setSelectedImage(product.image[0])
    setSelectedSize(product.sizes[0] || '')
    setQuantity(1)
  }, [product])

  if (!product) {
    return (
      <section className='mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-10'>
        <p className='rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500'>
          Product Not Found
        </p>
        <h1 className='mt-5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl'>
          This product does not exist anymore.
        </h1>
        <p className='mt-2 max-w-md text-sm text-neutral-600 sm:text-base'>
          It may have been removed or the product link is incorrect.
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
    <section className='relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 sm:pb-16 lg:px-10'>
      <div className='absolute -left-14 top-10 h-48 w-48 rounded-full bg-amber-200/35 blur-3xl' />
      <div className='absolute -right-16 top-32 h-60 w-60 rounded-full bg-sky-300/30 blur-3xl' />

      <div className='relative mx-auto w-full max-w-7xl'>
        <div className='mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-neutral-500 sm:text-sm'>
          <Link to='/' className='transition-colors hover:text-neutral-900'>
            Home
          </Link>
          <span>/</span>
          <Link to='/collection' className='transition-colors hover:text-neutral-900'>
            Collection
          </Link>
          <span>/</span>
          <span className='text-neutral-700'>{product.name}</span>
        </div>

        <div className='grid gap-8 rounded-3xl border border-neutral-200/80 bg-white/90 p-5 shadow-xl shadow-black/5 backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-8'>
          <div className='grid gap-4 sm:grid-cols-[90px_1fr]'>
            <div className='order-2 flex gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible'>
              {product.image.map((img, index) => (
                <button
                  key={`${product._id}-${index}`}
                  type='button'
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-xl border transition-all duration-200 ${selectedImage === img
                    ? 'border-neutral-900 ring-2 ring-neutral-200'
                    : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className='h-20 w-20 object-cover sm:h-21.5 sm:w-21.5'
                  />
                </button>
              ))}
            </div>

            <div className='order-1 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 sm:order-2'>
              <img
                src={selectedImage || product.image[0]}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            </div>
          </div>

          <div>
            <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600'>
              {product.category} / {product.subCategory}
            </p>

            <h1 className='mt-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl'>
              {product.name}
            </h1>

            <div className='mt-4 flex items-center gap-3'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <img
                    key={`filled-${index}`}
                    src={assets.star_icon}
                    alt='Star'
                    className='h-4 w-4 sm:h-5 sm:w-5'
                  />
                ))}
                <img
                  src={assets.star_dull_icon}
                  alt='Star'
                  className='h-4 w-4 sm:h-5 sm:w-5'
                />
              </div>
              <p className='text-sm text-neutral-500'>(124 verified reviews)</p>
            </div>

            <p className='mt-5 text-3xl font-bold text-neutral-900'>
              {currency}
              {product.price.toFixed(2)}
            </p>

            <p className='mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base'>
              {product.description}
            </p>

            <div className='mt-6'>
              <p className='text-sm font-semibold uppercase tracking-[0.13em] text-neutral-700'>
                Select Size
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200 ${selectedSize === size
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <div className='inline-flex items-center rounded-xl border border-neutral-300'>
                <button
                  type='button'
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className='px-4 py-2 text-lg text-neutral-700 transition-colors hover:bg-neutral-100'
                  aria-label='Decrease quantity'
                >
                  -
                </button>
                <span className='min-w-10 px-2 text-center text-sm font-semibold text-neutral-900'>
                  {quantity}
                </span>
                <button
                  type='button'
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className='px-4 py-2 text-lg text-neutral-700 transition-colors hover:bg-neutral-100'
                  aria-label='Increase quantity'
                >
                  +
                </button>
              </div>

              <button
                type='button'
                onClick={handleAddToCart}
                className='inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black'
              >
                Add To Cart
              </button>

              <button
                type='button'
                className='inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900'
              >
                Buy Now
              </button>
            </div>

            <div className='mt-7 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 sm:grid-cols-2'>
              <p>
                <span className='font-semibold text-neutral-900'>Delivery:</span> Estimated 2-4 business days.
              </p>
              <p>
                <span className='font-semibold text-neutral-900'>Shipping Fee:</span> {currency}{deliveryFee.toFixed(2)}.
              </p>
              <p>
                <span className='font-semibold text-neutral-900'>Return Policy:</span> 7-day easy returns.
              </p>
              <p>
                <span className='font-semibold text-neutral-900'>Support:</span> 24/7 order assistance.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-black/5 sm:p-6'>
          <h2 className='text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl'>
            Product Details
          </h2>
          <div className='mt-3 grid gap-4 text-sm leading-relaxed text-neutral-600 sm:grid-cols-2'>
            <p>
              Designed with premium fabric blends and a comfort-first silhouette, this piece is built for everyday styling and long-term wear.
            </p>
            <p>
              Pair it with your favorite denim, joggers, or layered outerwear for a clean and versatile look across seasons.
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className='mt-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg shadow-black/5 sm:p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold tracking-tight text-neutral-900'>Related Products</h2>
              <Link
                to='/collection'
                className='text-sm font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-neutral-900'
              >
                View More
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
              {relatedProducts.map((item) => (
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
                  <p className='mt-2 text-sm font-bold text-neutral-900'>
                    {currency}
                    {item.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Product
