import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faChevronDown, faBagShopping,
  faUser, faSignOutAlt, faTachometerAlt, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'

export default function Header() {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch {
        console.error('Invalid token')
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setIsUserMenuOpen(false)
    navigate('/')
    
  }

  const openPopup = (url) => {
    const width = 400, height = 500
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    window.open(url, 'AuthPopup', `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`)
  }

  const truncateEmail = (email) => (email.length > 30 ? email.slice(0, 27) + '...' : email)

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white bg-[#242525]">
      <div className="relative z-10 md:px-20 mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
          </button>

          <nav className="hidden lg:flex gap-8 text-sm md:text-base">
            <Link to="/" className="hover:underline">Home</Link>
            {user?.role=="admin"&&<Link to="/dashboard">Dashboard</Link>}
            <Link to="/shop" className="hover:underline">Shop</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search our collection"
              className="bg-transparent border-b border-white focus:outline-none text-white placeholder-gray-300 w-64"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute right-2 text-white cursor-pointer" />
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => {
              setIsUserMenuOpen((prev) => !prev)
              setIsMobileMenuOpen(false) 
            }} className="flex items-center space-x-2 hover:underline">
              <FontAwesomeIcon icon={faUser} />
              <FontAwesomeIcon icon={faChevronDown} />
            </button>

            {isUserMenuOpen && (
              <>
                {/* Desktop Dropdown */}
                <div className="hidden lg:block absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50 text-sm bg-[#242525]">
                  <div className="px-4 py-2 border-b border-gray-700">
                    {user ? truncateEmail(user.email) : 'Guest'}
                  </div>
                  {user ? (
                    <>
                      <Link to="/cart" className="flex items-center px-4 py-2 hover:bg-[#2d2d2d]">
                        <FontAwesomeIcon icon={faBagShopping} className="mr-2" /> Shopping Cart
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-[#2d2d2d]">
                          <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" /> Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 hover:bg-[#2d2d2d]">
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => openPopup('/login')} className="w-full text-left px-4 py-2 hover:bg-[#2d2d2d]">Login</button>
                      <button onClick={() => openPopup('/signup')} className="w-full text-left px-4 py-2 hover:bg-[#2d2d2d]">Sign Up</button>
                    </>
                  )}
                </div>

                {/* Mobile Dropdown */}
                <div className="lg:hidden fixed top-[40px] left-0 w-full text-white flex flex-col items-start text-sm py-4 z-40 bg-[#242525]">
                  <div className="px-6 py-2 w-full border-b border-gray-700">
                    {user ? truncateEmail(user.email) : 'Guest'}
                  </div>
                  {user ? (
                    <>
                      <Link to="/cart" className="px-6 py-2 hover:bg-[#2d2d2d]" onClick={() => setIsUserMenuOpen(false)}>
                        <FontAwesomeIcon icon={faBagShopping} className="mr-2" /> Shopping Cart
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/dashboard" className="px-6 py-2 hover:bg-[#2d2d2d]" onClick={() => setIsUserMenuOpen(false)}>
                          <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" /> Dashboard
                        </Link>
                      )}
                      <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-2 hover:bg-[#2d2d2d]">
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { openPopup('/login'); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-2 hover:bg-[#2d2d2d]">Login</button>
                      <button onClick={() => { openPopup('/signup'); setIsUserMenuOpen(false); }} className="w-full text-left px-6 py-2 hover:bg-[#2d2d2d]">Sign Up</button>
                    </>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full text-white flex flex-col items-start px-6 py-4 z-40 bg-[#242525]">
          <nav className="flex flex-col gap-4 w-full text-sm">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            {user?.role=="admin"&&<Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>}
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
