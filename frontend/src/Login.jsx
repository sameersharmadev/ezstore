import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Login() {
  const [email, setEmail] = useState('admin@kairo.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const loginResponse = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      const token = loginResponse.data
      localStorage.setItem('authToken', token)

      if (window.opener) {
        window.opener.location.href = '/'
        window.close()
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
      setLoading(false)
    }
  }

  const handleShowPassword = () => setShowPassword(true)
  const handleHidePassword = () => setShowPassword(false)

  return (
      <form
        onSubmit={handleLogin}
        className="w-full min-h-screen p-6 bg-white text-gray-900 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-1">Login to your account</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your credentials below to login</p>

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="me@example.com"
          className="w-full px-3 py-2 mb-4 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-sm mb-1 relative">
          Password
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onMouseDown={handleShowPassword}
              onMouseUp={handleHidePassword}
              onMouseLeave={handleHidePassword}
              onTouchStart={handleShowPassword}
              onTouchEnd={handleHidePassword}
              className="absolute right-4 top-1/3 transform -translate-y-1/3 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition mb-3 ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-black text-white hover:bg-white hover:border hover:text-black'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="underline hover:text-black">
            Sign Up
          </Link>
        </p>

        {error && <p className="text-sm text-center mt-3">{error}</p>}
      </form>
  )
}
