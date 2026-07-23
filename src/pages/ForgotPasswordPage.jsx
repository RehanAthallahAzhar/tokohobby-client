import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // Simulate recovery link sending
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Tautan pemulihan kata sandi telah dikirim ke email Anda. Silakan cek kotak masuk Anda.');
      setEmail('');
    }, 1500);
  };

  return (
    <AuthLayout title="Lupa Kata Sandi?">
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>

        <div>
          <label 
            htmlFor="email" 
            className="block text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-1.5 ml-3"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-5 py-3 rounded-full border-2 border-cyan-100/80 dark:border-gray-800 bg-white dark:bg-gray-850 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-full shadow-lg shadow-cyan-500/20 text-sm font-bold text-white bg-cyan-650 hover:bg-cyan-700 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <LoadingSpinner /> : 'Kirim Tautan Pemulihan'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-650 dark:text-gray-400">
        Kembali ke{' '}
        <Link to="/login" className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors duration-150">
          Halaman Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
