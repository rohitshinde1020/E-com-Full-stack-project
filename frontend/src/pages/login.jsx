import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Shopcontext } from '../context/shopcontext'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const Login = () => {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { setToken } = useContext(Shopcontext)

  const isSignIn = mode === 'signin'

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Please enter both email and password.')
      return
    }

    if (!isSignIn) {
      if (!trimmedName) {
        toast.error('Please enter your name.')
        return
      }

      if (trimmedPassword !== trimmedConfirmPassword) {
        toast.error('Passwords do not match.')
        return
      }
    }

    try {
      setIsSubmitting(true)

      const endpoint = isSignIn ? '/api/users/login' : '/api/users/register'
      const payload = isSignIn
        ? { email: trimmedEmail, password: trimmedPassword }
        : { name: trimmedName, email: trimmedEmail, password: trimmedPassword }

      const response = await axios.post(`${backendUrl}${endpoint}`, payload)

      if (!response.data?.success) {
        const message = response.data?.message || 'Authentication failed.'
        toast.error(message)
        return
      }

      const token = response.data?.token || ''
      if (token) {
        localStorage.setItem('token', token)
        setToken(token)
      }

      toast.success(response.data?.message || (isSignIn ? 'Signed in successfully!' : 'Account created successfully!'))
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.message || 'Request failed. Please check the backend server.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='absolute -left-20 top-10 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl' />
      <div className='absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-cyan-300/30 blur-3xl' />

      <div className='relative w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white/85 p-8 shadow-xl shadow-black/5 backdrop-blur-sm'>
        {/* Header */}
        <p className='inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600'>
          {isSignIn ? 'Welcome Back' : 'Join Us'}
        </p>

        <h1 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900'>
          {isSignIn ? 'Sign In' : 'Create Account'}
        </h1>
        <p className='mt-2 text-sm text-neutral-600'>
          {isSignIn
            ? 'Enter your credentials to continue'
            : 'Fill in your details to get started'}
        </p>

        {/* Toggle Buttons */}
        <div className='mt-6 flex gap-3'>
          <button
            type='button'
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
              isSignIn
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Sign In
          </button>
          <button
            type='button'
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
              !isSignIn
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
          {!isSignIn && (
            <div>
              <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                Full Name
              </label>
              <input
                type='text'
                placeholder='Enter your full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-semibold text-neutral-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-neutral-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200'
            />
          </div>

          {!isSignIn && (
            <div>
              <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                Confirm Password
              </label>
              <input
                type='password'
                placeholder='Re-enter your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-sm outline-none transition-colors focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200'
              />
            </div>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full mt-6 bg-neutral-900 text-white py-3 rounded-lg font-semibold uppercase tracking-[0.12em] hover:bg-black hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
          >
            {isSubmitting ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <p className='text-center mt-6 text-sm text-neutral-600'>
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          <button
            type='button'
            onClick={() => {
              setMode(isSignIn ? 'signup' : 'signin')
              setName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
            }}
            className='text-neutral-900 font-semibold ml-2 hover:underline decoration-neutral-300 underline-offset-2'
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
              