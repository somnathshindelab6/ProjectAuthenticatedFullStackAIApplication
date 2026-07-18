import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await api.login(email, password)
    if (res.access_token) {
      localStorage.setItem('access_token', res.access_token)
      navigate('/')
    } else {
      setMessage(res.msg || 'Login failed. Please try again.')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-md rounded-3xl bg-white p-8 shadow-xl'>
        <h1 className='text-3xl font-semibold text-slate-900 mb-3'>Welcome back</h1>
        <p className='text-sm text-slate-500 mb-6'>Log in to manage tasks, set priorities, and get AI recommendations.</p>

        {message && <div className='mb-4 rounded-2xl bg-rose-100 px-4 py-3 text-rose-700'>{message}</div>}

        <form onSubmit={submit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none' placeholder='you@example.com' />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none' placeholder='••••••••' />
          </div>
          <button type='submit' className='w-full rounded-2xl bg-sky-600 px-4 py-3 text-base font-semibold text-white hover:bg-sky-700 transition'>Log in</button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-500'>New user? <button onClick={() => navigate('/register')} className='font-semibold text-sky-600 hover:text-sky-700'>Create an account</button></p>
      </div>
    </div>
  )
}
