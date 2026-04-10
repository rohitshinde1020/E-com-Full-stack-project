import React, { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shopcontext } from '../context/shopcontext'

const Collection = () => {
  const { products, currency, searchQuery, setSearchQuery } = useContext(Shopcontext)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [sortOption, setSortOption] = useState('default')

  

  // Get unique categories and subcategories from products
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))]
  }, [products])

  const subCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.subCategory))]
  }, [products])

  // Filter products based on search and selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesSubCategory = !selectedSubCategory || product.subCategory === selectedSubCategory

      return matchesSearch && matchesCategory && matchesSubCategory
    })
  }, [products, searchQuery, selectedCategory, selectedSubCategory])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [filteredProducts, sortOption])

  return (
    <section className='relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-10'>
      <div className='absolute -left-12 top-6 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-16 top-20 h-60 w-60 rounded-full bg-cyan-300/30 blur-3xl' />

      <div className='relative mx-auto max-w-7xl rounded-3xl border border-neutral-200/80 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8 lg:p-10'>
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          Explore Store
        </p>

        <h1 className='mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl'>
          Find Your Perfect Style Match
        </h1>

        <p className='mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base'>
          Use the filters below to search by category, subcategory, or product name. Click any item to view full details.
        </p>
      </div>

      <div className='relative mx-auto mt-8 max-w-7xl'>
        <div className=' relative grid gap-6 lg:grid-cols-[200px_1fr] '>
          <div className='sticky top-20 rounded-2xl border border-neutral-200 bg-white p-4 h-fit sm:p-5'>
            <h3 className='text-lg font-semibold text-neutral-900'>Filters</h3>

            <div className='mt-5 space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                  Search Product
                </label>
                <input
                  type='text'
                  placeholder='Search name...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                  Category
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-sm cursor-pointer'>
                    <input
                      type='radio'
                      name='category'
                      value=''
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className='h-4 w-4 accent-neutral-900'
                    />
                    <span className='text-neutral-700'>All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className='flex items-center gap-2 text-sm cursor-pointer'>
                      <input
                        type='radio'
                        name='category'
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className='h-4 w-4 accent-neutral-900'
                      />
                      <span className='text-neutral-700'>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                  Type
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center gap-2 text-sm cursor-pointer'>
                    <input
                      type='radio'
                      name='subCategory'
                      value=''
                      checked={selectedSubCategory === null}
                      onChange={() => setSelectedSubCategory(null)}
                      className='h-4 w-4 accent-neutral-900'
                    />
                    <span className='text-neutral-700'>All</span>
                  </label>
                  {subCategories.map((subCat) => (
                    <label key={subCat} className='flex items-center gap-2 text-sm cursor-pointer'>
                      <input
                        type='radio'
                        name='subCategory'
                        value={subCat}
                        checked={selectedSubCategory === subCat}
                        onChange={() => setSelectedSubCategory(subCat)}
                        className='h-4 w-4 accent-neutral-900'
                      />
                      <span className='text-neutral-700'>{subCat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='font-semibold'>
                <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                  Sort
                </label>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-neutral-900'
                >
                  <option value='default'>Default</option>
                  <option value='price-asc'>Price: Low to High</option>
                  <option value='price-desc'>Price: High to Low</option>
                </select>
              </div>

              {(searchQuery || selectedCategory || selectedSubCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                    setSelectedSubCategory(null)
                  }}
                  className='w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-black'
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>



          <div className='rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-neutral-900'>
                Products{' '}
                <span className='text-sm font-normal text-neutral-600'>
                  ({sortedProducts.length})
                </span>
              </h2>
            </div>

            {sortedProducts.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 py-12 text-center'>
                <p className='text-sm text-neutral-600'>No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                    setSelectedSubCategory(null)
                  }}
                  className='mt-3 text-sm font-semibold text-neutral-900 underline'
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4'>
                {sortedProducts.map((item) => (
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
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Collection
