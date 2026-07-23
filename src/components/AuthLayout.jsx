import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuthLayout = ({ title, children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Full-Page Background Image with Blur Tint Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=1600" 
          alt="Hobby Collection Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-950/50 dark:bg-gray-950/70 backdrop-blur-[6px]"></div>
      </div>



      {/* Centered Glassmorphic Form Card */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16 z-10">
        <div className="max-w-md w-full animate-scale-in">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-white/40 dark:border-gray-800/80 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex justify-center mb-3">
              <Link to="/" className="text-xl font-black text-cyan-600 tracking-tight flex items-center gap-1.5 group">
                <span className="bg-cyan-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform duration-300">T</span>
                Toko<span className="text-cyan-400 font-medium">hobby</span>
              </Link>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">
              {title}
            </h3>
            
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;