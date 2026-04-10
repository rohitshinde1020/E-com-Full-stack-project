import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App.jsx'

const Login =  ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setToken(token)
    }

  }, [setToken])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const response = await axios.post(`${backendUrl}/api/users/adminlogin`, { email, password })

      if (response.data?.success && response.data?.token) {
        localStorage.setItem('adminToken', response.data.token)
        setToken(response.data.token)
        toast.success(response.data.message || 'Login successful')

      } else {
        setError(response.data?.message || 'Unable to login. Please try again.')
      }
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Request failed. Check backend URL or server status.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 px-4 py-10'>
      <div className='pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-300/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl' />

      <div className='relative w-full max-w-md rounded-3xl border border-white/60 bg-white/85 p-7 shadow-[0_24px_80px_-20px_rgba(234,88,12,0.45)] backdrop-blur md:p-8'>
        <div className='mb-7 text-center'>
          <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600'>
            Admin Portal
          </p>
          <h1 className='mt-4 text-3xl font-black tracking-tight text-gray-900'>Welcome Back</h1>
          <p className='mt-2 text-sm text-gray-500'>Sign in to manage products, orders, and store data.</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-4'>
          <div>
            <label htmlFor='admin-email' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              id='admin-email'
              type='email'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='admin@store.com'
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            />
          </div>

          <div>
            <label htmlFor='admin-password' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              id='admin-password'
              type='password'
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='Enter your password'
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            />
          </div>

          {error && <p className='text-sm font-medium text-red-500'>{error}</p>}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-200'
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
