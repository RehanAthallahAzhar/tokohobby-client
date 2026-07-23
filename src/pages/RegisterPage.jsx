import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import AuthLayout from '../components/AuthLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'admin', 
        adminToken: '', 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
        const res = await auth.register(
            formData.name,
            formData.username,
            formData.email,
            formData.password,
            formData.role,
            formData.adminToken
        );
    setSuccess(res.message); 
    setFormData({
        name: '', username: '', email: '', password: '', role: 'admin', adminToken: '',
    });
    setTimeout(() => {
        navigate('/login');
    }, 2000);

    } catch (err) {
        const message = err.response?.data?.message || 'Registration failed. Please try again.';
        setError(message);
    } finally {
        setIsLoading(false);
    }
    };


  return (
    <AuthLayout title="Daftar Akun Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-pulse" role="alert">
            <span className="block sm:inline">{success}. Mengalihkan ke halaman masuk...</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3">Nama Lengkap</label>
          <input 
            name="name" 
            type="text" 
            placeholder="Nama Lengkap Anda" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3">Username</label>
          <input 
            name="username" 
            type="text" 
            placeholder="Username unik" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3">Email</label>
          <input 
            name="email" 
            type="email" 
            placeholder="Alamat email aktif" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>
        
        <div className="flex justify-end py-1 px-2">
          <Link 
            to="/forgot-password" 
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            Lupa Password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || success} 
            className="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-full shadow-lg shadow-cyan-500/20 text-sm font-bold text-white bg-cyan-650 hover:bg-cyan-700 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <LoadingSpinner /> : 'Daftar Sekarang'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-650 dark:text-gray-400">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors duration-150">
          Masuk Sekarang
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;