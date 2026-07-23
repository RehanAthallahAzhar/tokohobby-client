import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { useCart } from '../hooks/useCart'; 
import { HiOutlineUserCircle, HiOutlineShoppingCart, HiOutlineLogin, HiOutlineUserAdd, HiOutlineSearch } from 'react-icons/hi';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, token, logout } = useAuth(); 
  const { totalItems } = useCart(); 
  const { theme, toggleTheme } = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          
          {/* Logo - Visible everywhere */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl sm:text-2xl font-black text-cyan-650 tracking-tight flex items-center gap-1.5 group">
              <span className="bg-cyan-650 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-sm sm:text-lg shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">T</span>
              <span>Toko<span className="text-cyan-400 font-medium">hobby</span></span>
            </Link>
          </div>

          {/* Search Bar - Inline everywhere (takes remaining space) */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari hobi..."
                  className="w-full py-1.5 sm:py-2.5 pl-8 sm:pl-11 pr-4 sm:pr-5 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border border-cyan-100 dark:border-gray-700 rounded-full focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-550 dark:text-gray-100 dark:placeholder-gray-450 transition-all"
                />
                <button 
                  type="submit" 
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors bg-transparent border-0 cursor-pointer"
                  aria-label="Cari"
                >
                  <HiOutlineSearch size={14} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex-shrink-0 flex items-center space-x-1 sm:space-x-2">
            {/* Cart Icon - Always visible */}
            <Link to="/cart" aria-label="Keranjang Belanja" className="relative text-gray-600 dark:text-gray-400 hover:text-cyan-650 dark:hover:text-cyan-400 transition-colors p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
              <HiOutlineShoppingCart size={20} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-cyan-600 text-white text-[9px] sm:text-xs font-black shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop-only theme switcher */}
            <div className="hidden md:block">
              <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
            </div>

            {/* Desktop-only auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {token ? (
                <>
                  <Link 
                    to="/orders" 
                    aria-label="Pesanan Saya" 
                    className="relative text-gray-600 dark:text-gray-400 hover:text-cyan-650 dark:hover:text-cyan-400 transition-colors p-2 bg-gray-55 dark:bg-gray-800 rounded-full"
                  >
                    <HiOutlineArchiveBox size={22} />
                  </Link>
                  <Link to="/profile" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-cyan-650 dark:hover:text-cyan-400 transition-colors p-1">
                    <HiOutlineUserCircle size={26} />
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200 hidden sm:inline ml-1.5">
                      {user?.name || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs font-black text-red-500 hover:text-red-700 transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-cyan-600 transition-colors">
                    <HiOutlineLogin size={16} />
                    Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-1 text-xs font-black text-white bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-full transition-all shadow-md">
                    <HiOutlineUserAdd size={14} />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button - Visible only under md */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Dropdown Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-slide-in-top">
            {token ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <HiOutlineUserCircle size={32} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      Lihat Profil
                    </Link>
                  </div>
                </div>
                <Link 
                  to="/orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 py-1 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-cyan-600 transition-colors"
                >
                  <HiOutlineArchiveBox size={18} />
                  Pesanan Saya
                </Link>
                <button 
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2.5 py-1 text-sm font-black text-red-500 hover:text-red-700 transition-colors bg-transparent border-0 cursor-pointer outline-none"
                >
                  <HiOutlineLogin size={18} className="rotate-180" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 dark:border-gray-750 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  <HiOutlineLogin size={16} />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-cyan-600 text-white text-sm font-black rounded-xl hover:bg-cyan-700 transition-all shadow-md shadow-cyan-500/10"
                >
                  <HiOutlineUserAdd size={16} />
                  Register
                </Link>
              </div>
            )}

            {/* Dark Light Theme Toggle inside Menu */}
            <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Mode Tampilan</span>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-150 dark:border-gray-750">
                <button 
                  onClick={() => { if (theme === 'dark') toggleTheme(); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-white dark:bg-gray-900 text-cyan-600 shadow-xs' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Terang
                </button>
                <button 
                  onClick={() => { if (theme === 'light') toggleTheme(); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-white dark:bg-gray-900 text-cyan-400 shadow-xs' : 'text-gray-500 hover:text-gray-400'}`}
                >
                  Gelap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;