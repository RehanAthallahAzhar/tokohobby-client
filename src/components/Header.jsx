import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { useCart } from '../hooks/useCart'; 
import { HiOutlineUserCircle, HiOutlineShoppingCart, HiOutlineLogin, HiOutlineUserAdd, HiOutlineSearch, HiOutlineHome } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, token, logout } = useAuth(); 
  const { totalItems } = useCart(); 
  const { theme, toggleTheme } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex justify-between items-center gap-4">
          
          {/* Left side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard/products" className="text-3xl font-extrabold text-blue-900 dark:text-blue-400">
              Toko<span className="text-cyan-500">hobby</span>
            </Link>
          </div>

          {/* middle: category & Search Bar */}
          <div className="flex-1 flex items-start justify-start gap-4 px-4">
            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari mainan, action figure..."
                  className="w-full py-2.5 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button 
                  type="submit" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                  aria-label="Cari"
                >
                  <HiOutlineSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-2 md:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />

            {token ? (
              <>
                <Link to="/cart" aria-label="Keranjang Belanja" className="relative text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-2">
                  <HiOutlineShoppingCart size={26} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/orders" 
                  aria-label="Pesanan Saya" 
                  className="relative text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-2"
                >
                  <HiOutlineArchiveBox size={26} />
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-1">
                    <HiOutlineUserCircle size={28} />
                    <span className="font-medium text-gray-800 dark:text-gray-200 hidden sm:inline ml-2">
                      {user?.name || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="block text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  <HiOutlineLogin size={18} />
                  Login
                </Link>
                <Link to="/register" className="flex items-center gap-1 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors">
                  <HiOutlineUserAdd size={18} />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;