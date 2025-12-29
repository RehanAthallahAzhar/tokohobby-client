import React from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineShoppingBag, HiSparkles } from 'react-icons/hi';
import { HiArrowRight } from 'react-icons/hi2';


const formatCurrency = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

const CartPage = () => {
  const { cart, loading } = useCart(); 

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Memuat keranjang...</p>
          </div>
        </div>
      );
    }

    if (!cart || cart.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-12 rounded-full border-4 border-gray-300 dark:border-gray-700">
              <HiOutlineShoppingCart className="text-gray-400 dark:text-gray-600" size={80} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Keranjang Kosong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Yuk, mulai belanja dan tambahkan produk favoritmu ke keranjang!
          </p>
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <HiOutlineShoppingBag size={24} />
            <span>Mulai Belanja</span>
            <HiArrowRight className="transition-transform group-hover:translate-x-2" size={20} />
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left : Item list*/}
        <div className="lg:col-span-2 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <HiOutlineShoppingCart className="text-cyan-600 dark:text-cyan-400" size={32} />
                Keranjang Belanja
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {cart.total_items} item dalam keranjang
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <div 
                key={item.product_id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Shopping Summary*/}
        <div className="lg:col-span-1 animate-fade-in [animation-delay:200ms]">
          <div className="sticky top-28 bg-gradient-to-br from-white via-cyan-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-3xl border-2 border-cyan-200 dark:border-cyan-800 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <HiSparkles className="text-cyan-600 dark:text-cyan-400 animate-pulse" size={24} />
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                Ringkasan Belanja
              </h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal ({cart.total_items} item)</span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              
              <div className="bg-cyan-50 dark:bg-cyan-950/50 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 dark:text-white">Total Pembayaran</span>
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
              Pajak dan biaya pengiriman akan dihitung saat checkout
            </p>

            <Link
              to="/checkout"
              className={`group relative w-full flex items-center justify-center gap-3 py-5 px-6 border-none rounded-2xl text-lg font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                subtotal === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <span className="relative">Lanjut ke Checkout</span>
              <HiArrowRight className="relative transition-transform group-hover:translate-x-2" size={24} />
            </Link>
            
            <Link
              to="/"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-cyan-600 dark:text-cyan-400 font-semibold hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            >
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {renderContent()}
      </div>
    </main>
  );
};

export default CartPage;
