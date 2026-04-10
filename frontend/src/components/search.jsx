import React, { useContext, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Shopcontext } from '../context/shopcontext'

const Search = () => {
	const location = useLocation()
	const inputRef = useRef(null)
	const { isSearchVisible, setIsSearchVisible, searchQuery, setSearchQuery } = useContext(Shopcontext)

	useEffect(() => {
		if (isSearchVisible) {
			inputRef.current?.focus()
		}
	}, [isSearchVisible])

	if (!isSearchVisible || location.pathname !== '/collection') {
		return null
	}

	return (
		<section className='relative z-40 border-b border-neutral-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 lg:px-10'>
			<div className='mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-lg shadow-black/5'>
				<img src={assets.search_icon} alt='Search' className='h-5 w-5 shrink-0' />

				<input
					ref={inputRef}
					type='text'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder='Search products, styles, colors...'
					className='w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base'
				/>

				<button
					type='button'
					onClick={() => {
						setSearchQuery('')
						setIsSearchVisible(false)
					}}
					className='rounded-full border border-neutral-200 p-2 transition-colors hover:bg-neutral-100'
					aria-label='Close search'
				>
					<img src={assets.cross_icon} alt='Close search' className='h-4 w-4' />
				</button>
			</div>
		</section>
	)
}

export default Search
