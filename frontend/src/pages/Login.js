import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [mode, setMode] = useState('login')
  const [token, setToken] = useState('')
  const [resetRequested, setResetRequested] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (mode === 'forgot') {
      if (!email.trim()) {
        setMessageType('error')
        setMessage('Please enter your email address.')
        return
      }
      const res = await api.forgotPassword(email)
      setMessageType(res.msg && res.msg.toLowerCase().includes('sent') ? 'success' : 'error')
      setMessage(res.msg || 'Unable to process your request right now.')
      setResetRequested(true)
      if (res.msg && res.msg.toLowerCase().includes('sent')) {
        setMode('reset')
      }
      return
    }

    if (mode === 'reset') {
      if (!token.trim() || !password.trim()) {
        setMessageType('error')
        setMessage('Please enter both a reset token and a new password.')
        return
      }
      const res = await api.resetPassword(token, password)
      const isSuccess = Boolean(res.msg && res.msg.toLowerCase().includes('success'))
      setMessageType(isSuccess ? 'success' : 'error')
      setMessage(res.msg || 'Unable to reset your password right now.')
      if (isSuccess) {
        setMode('login')
        setPassword('')
        setToken('')
        setResetRequested(false)
      }
      return
    }

    if (!email.trim() || !password.trim()) {
      setMessageType('error')
      setMessage('Please enter both email and password.')
      return
    }

    const res = await api.login(email, password)
    if (res.access_token) {
      localStorage.setItem('access_token', res.access_token)
      navigate('/')
    } else {
      setMessageType('error')
      setMessage(res.msg || 'Login failed. Please try again.')
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
    setMessageType('info')
    if (nextMode !== 'reset') {
      setResetRequested(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-md rounded-3xl bg-white p-8 shadow-xl'>
        <h1 className='text-3xl font-semibold text-slate-900 mb-3'>Welcome back</h1>
        <p className='text-sm text-slate-500 mb-6'>Log in to manage tasks, set priorities, and get AI recommendations.</p>

        {message && <div className={`mb-4 rounded-2xl px-4 py-3 ${messageType === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{message}</div>}

        <div className='mb-4 flex flex-wrap gap-2'>
          <button type='button' onClick={() => switchMode('login')} className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Login</button>
          <button type='button' onClick={() => switchMode('forgot')} className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === 'forgot' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Forgot password</button>
          <button type='button' onClick={() => switchMode('reset')} className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === 'reset' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Reset password</button>
        </div>

        {mode === 'reset' && !resetRequested && (
          <p className='mb-4 text-sm text-slate-500'>Request a reset first, then come back here with the token to create a new password.</p>
        )}

        <form onSubmit={submit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Email</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none' placeholder='you@example.com' />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>{mode === 'reset' ? 'New password' : 'Password'}</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none' placeholder='••••••••' />
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Reset token</label>
              <input type='text' value={token} onChange={e => setToken(e.target.value)} className='w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none' placeholder='Paste the reset token' />
            </div>
          )}

          <button type='submit' className='w-full rounded-2xl bg-sky-600 px-4 py-3 text-base font-semibold text-white hover:bg-sky-700 transition'>
            {mode === 'forgot' ? 'Send reset link' : mode === 'reset' ? 'Reset password' : 'Log in'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-500'>New user? <button onClick={() => navigate('/register')} className='font-semibold text-sky-600 hover:text-sky-700'>Create an account</button></p>
      </div>
    </div>
  )
}
