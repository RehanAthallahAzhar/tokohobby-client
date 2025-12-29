import React, { useState, useEffect, useCallback } from 'react';
import { orderApi } from '../services/api';
import { Link } from 'react-router-dom';
import { HiOutlineArchiveBox, HiOutlineArrowLeft, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTruck, HiOutlineShoppingBag } from 'react-icons/hi2';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

import ConfirmModal from '../components/ConfirmModal'; 

const formatCurrency = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

const getStatusConfig = (status) => {
  const configs = {
    'PENDING_PAYMENT': {
      color: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-700',
      icon: HiOutlineClock,
      label: 'Menunggu Pembayaran'
    },
    'PAID': {
      color: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-700',
      icon: HiOutlineCheckCircle,
      label: 'Dibayar'
    },
    'SHIPPED': {
      color: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-400 border-purple-300 dark:border-purple-700',
      icon: HiOutlineTruck,
      label: 'Dikirim'
    },
    'DELIVERED': {
      color: 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700',
      icon: HiOutlineCheckCircle,
      label: 'Selesai'
    },
    'CANCELED': {
      color: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-red-300 dark:border-red-700',
      icon: HiOutlineXCircle,
      label: 'Dibatalkan'
    }
  };
  return configs[status] || configs['PENDING_PAYMENT'];
};

const OrderCard = ({ orderData, onOpenCancelModal }) => {
  const { order, items } = orderData;
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const handleCancelClick = () => {
    onOpenCancelModal(order); 
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1">
      {/* Header Card */}
      <div className="p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse"></div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID: #{order.id}</p>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {new Date(order.created_at).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(order.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
              })} WIB
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 ${statusConfig.color} transition-transform group-hover:scale-105`}>
            <StatusIcon size={20} />
            <span>{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Body Card */}
      <div className="p-6 space-y-4 bg-white dark:bg-gray-900">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all hover:border-cyan-500 dark:hover:border-cyan-400"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative group/img">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
              <img 
                src={`https://placehold.co/80x80/E0F2E9/333333?text=${item.product_name.split(' ')[0]}`}
                alt={item.product_name}
                className="w-20 h-20 rounded-xl object-cover transition-transform group-hover/img:scale-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{item.product_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Penjual:</span> {item.seller_name}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {item.quantity} × {formatCurrency(item.product_price)}
                </span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  = {formatCurrency(item.quantity * item.product_price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Card */}
      <div className="p-6 bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pembayaran</p>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {formatCurrency(order.total_price)}
            </p>
          </div>
          
          {order.status === 'PENDING_PAYMENT' && (
            <button
              onClick={handleCancelClick}
              className="group/btn relative px-6 py-3 font-bold text-sm text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 dark:from-red-500 dark:to-pink-500 rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-2">
                <HiOutlineXCircle size={18} />
                Batalkan Pesanan
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.get('/');
      setOrders(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil pesanan:", err);
      setError(err.response?.data?.message || 'Gagal memuat riwayat pesanan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenConfirmModal = (order) => {
    setOrderToCancel(order);
    setIsConfirmModalOpen(true);
  };
  
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setIsCanceling(true);
    
    try {
      await orderApi.post(`/${orderToCancel.id}/cancel`);
      
      fetchOrders(); 
      setIsConfirmModalOpen(false);
      setOrderToCancel(null);

    } catch (err) {
      console.error("Gagal membatalkan pesanan:", err);
      alert("Gagal membatalkan pesanan: " + (err.response?.data?.message || err.message));
    } finally {
      setIsCanceling(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Memuat riwayat pesanan...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 bg-red-100 dark:bg-red-950 border-2 border-red-300 dark:border-red-800 text-red-800 dark:text-red-400 rounded-2xl text-center animate-fade-in">
          <HiOutlineXCircle className="mx-auto mb-4 text-red-600 dark:text-red-400" size={48} />
          <p className="font-bold text-lg mb-2">Oops! Terjadi kesalahan</p>
          <p>{error}</p>
        </div>
      );
    }

    if (!loading && orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-12 rounded-full border-4 border-gray-300 dark:border-gray-700">
              <HiOutlineArchiveBox className="text-gray-400 dark:text-gray-600" size={80} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Belum Ada Pesanan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Anda belum melakukan transaksi apapun. Ayo mulai belanja dan temukan produk favoritmu!
          </p>
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <HiOutlineShoppingBag size={24} />
            <span>Mulai Belanja</span>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((orderData, index) => (
          <div 
            key={orderData.order.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <OrderCard 
              orderData={orderData}
              onOpenCancelModal={handleOpenConfirmModal}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <HiOutlineArchiveBox className="text-cyan-600 dark:text-cyan-400" size={40} />
              Riwayat Pesanan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Kelola dan lacak semua pesanan Anda</p>
          </div>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-white dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-cyan-600 dark:hover:bg-cyan-500 border-2 border-cyan-600 dark:border-cyan-400 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
          >
            <HiOutlineArrowLeft className="transition-transform group-hover:-translate-x-1" size={18} />
            Kembali Belanja
          </Link>
        </div>
      
        {renderContent()}

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleCancelOrder}
          isLoading={isCanceling}
          title="Batalkan Pesanan?"
          message={`Anda yakin ingin membatalkan pesanan? Aksi ini tidak dapat diurungkan.`}
          confirmText="Ya, Batalkan"
          cancelText="Tidak"
        />
      </div>
    </main>
  );
};

export default OrderHistoryPage;
