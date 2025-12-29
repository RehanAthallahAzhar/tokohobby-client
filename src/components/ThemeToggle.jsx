import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 bg-gray-200 dark:bg-cyan-600"
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDark}
    >
      {/* Sliding circle */}
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-9' : 'translate-x-1'
        }`}
      />
      
      {/* Sun icon (light mode) */}
      <HiOutlineSun
        className={`absolute left-2 h-4 w-4 transition-opacity duration-300 ${
          isDark ? 'opacity-0' : 'opacity-100 text-amber-500'
        }`}
      />
      
      {/* Moon icon (dark mode) */}
      <HiOutlineMoon
        className={`absolute right-2 h-4 w-4 transition-opacity duration-300 ${
          isDark ? 'opacity-100 text-white' : 'opacity-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
