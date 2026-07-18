import React from 'react'
import { Routes, Route, NavLink, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskDetail from './pages/TaskDetail'
import AIChat from './pages/AIChat'

const isAuthenticated = () => !!localStorage.getItem('access_token')

function RequireAuth({ children }) {
  const location = useLocation()
  return isAuthenticated() ? children : <Navigate to='/login' state={{ from: location }} replace />
}

function App() {
  const navigate = useNavigate()
  const token = isAuthenticated()

  const logout = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <header className='border-b border-slate-200 bg-white/90 backdrop-blur-sm'>
        <div className='container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4'>
          <Link to='/' className='text-xl font-semibold text-slate-900'>Docket</Link>
          <div className='flex flex-wrap items-center gap-3'>
            {token ? (
              <>
                <NavLink to='/' className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`} end>Dashboard</NavLink>
                <NavLink to='/ai' className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`} >AI Chat</NavLink>
                <button onClick={logout} className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50'>Logout</button>
              </>
            ) : (
              <>
                <NavLink to='/login' className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`} >Login</NavLink>
                <NavLink to='/register' className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`} >Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className='container mx-auto px-4 py-8'>
        <Routes>
          <Route path='/' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/tasks/:id' element={<RequireAuth><TaskDetail /></RequireAuth>} />
          <Route path='/ai' element={<RequireAuth><AIChat /></RequireAuth>} />
          <Route path='/login' element={token ? <Navigate to='/' replace /> : <Login />} />
          <Route path='/register' element={token ? <Navigate to='/' replace /> : <Register />} />
          <Route path='*' element={<Navigate to={token ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
