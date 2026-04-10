import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL']

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [price, setPrice] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const imageSlots = useMemo(
    () => [
      { id: 'image1', file: image1, setter: setImage1, label: 'Image 1' },
      { id: 'image2', file: image2, setter: setImage2, label: 'Image 2' },
      { id: 'image3', file: image3, setter: setImage3, label: 'Image 3' },
      { id: 'image4', file: image4, setter: setImage4, label: 'Image 4' },
    ],
    [image1, image2, image3, image4],
  )

  const resetForm = () => {
    setImage1(null)
    setImage2(null)
    setImage3(null)
    setImage4(null)
    setName('')
    setDescription('')
    setCategory('Men')
    setSubCategory('Topwear')
    setPrice('')
    setBestseller(false)
    setSelectedSizes([])
  }

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
    )
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!name.trim() || !description.trim() || !price || !category || !subCategory) {
      toast.error('Please fill all required product fields.')
      return
    }

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error('Please upload at least one product image.')
      return
    }

    if (selectedSizes.length === 0) {
      toast.error('Please select at least one product size.')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()

      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)

      formData.append('name', name.trim())
      formData.append('description', description.trim())
      formData.append('price', Number(price))
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('sizes', JSON.stringify(selectedSizes))
      formData.append('bestseller', String(bestseller))

      const response = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: {
          token,
        },
      })

      if (response.data?.success) {
        toast.success(response.data.message || 'Product added successfully!')
        resetForm()
      } else {
        toast.error(response.data?.message || 'Failed to add product.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed while adding product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6'>
        <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600'>
          Product Manager
        </p>
        <h1 className='mt-3 text-2xl font-bold text-gray-900 sm:text-3xl'>Add New Product</h1>
        <p className='mt-1 text-sm text-gray-500'>
          Upload up to 4 images, define product details, and publish to your store inventory.
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className='space-y-6'>
        <div>
          <p className='mb-3 text-sm font-semibold text-gray-700'>Product Images</p>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {imageSlots.map((slot) => (
              <label
                key={slot.id}
                htmlFor={slot.id}
                className='group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 transition-all duration-200 hover:border-red-300 hover:bg-red-50/40'
              >
                <input
                  id={slot.id}
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={(event) => slot.setter(event.target.files?.[0] || null)}
                />
                <img
                  src={slot.file ? URL.createObjectURL(slot.file) : assets.upload_area}
                  alt={slot.label}
                  className='h-24 w-full rounded-xl object-cover'
                />
                <span className='mt-2 text-xs font-medium text-gray-600'>{slot.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='md:col-span-2'>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>Product Name</label>
            <input
              type='text'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='e.g. Urban Fit Cotton Shirt'
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder='Write a clean product description for your admin catalog.'
              className='w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            >
              <option value='Men'>Men</option>
              <option value='Women'>Women</option>
              <option value='Kids'>Kids</option>
            </select>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>Sub Category</label>
            <select
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            >
              <option value='Topwear'>Topwear</option>
              <option value='Bottomwear'>Bottomwear</option>
              <option value='Winterwear'>Winterwear</option>
            </select>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-gray-700'>Price ($)</label>
            <input
              type='number'
              min='0'
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder='49.99'
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            />
          </div>

          <div>
            <p className='mb-1.5 block text-sm font-semibold text-gray-700'>Sizes</p>
            <div className='flex flex-wrap gap-2'>
              {availableSizes.map((size) => {
                const isSelected = selectedSizes.includes(size)
                return (
                  <button
                    key={size}
                    type='button'
                    onClick={() => toggleSize(size)}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-100'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <label className='inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700'>
          <input
            type='checkbox'
            checked={bestseller}
            onChange={(event) => setBestseller(event.target.checked)}
            className='h-4 w-4 accent-red-500'
          />
          Mark as Bestseller
        </label>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full rounded-xl bg-linear-to-r from-red-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8'
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </section>
  )
}

export default Add
