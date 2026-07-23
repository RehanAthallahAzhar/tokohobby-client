import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await auth.login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Selamat Datang Kembali!">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div>
          <label 
            htmlFor="username" 
            className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Masukkan username Anda"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div className="flex items-center justify-between py-1 px-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="rounded border-cyan-200 text-cyan-600 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-gray-650 dark:text-gray-400">Ingat Saya</span>
          </label>
          <Link 
            to="/forgot-password" 
            className="text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            Lupa Password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-full shadow-lg shadow-cyan-500/20 text-sm font-bold text-white bg-cyan-650 hover:bg-cyan-700 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <LoadingSpinner /> : 'Masuk ke Akun'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-650 dark:text-gray-400">
        Belum punya akun?{' '}
        <Link to="/register" className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors duration-150">
          Daftar Sekarang
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;