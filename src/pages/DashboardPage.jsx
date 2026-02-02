import React, { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const formatCurrency = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(number);

const DashboardPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { user } = useAuth();

    const fetchProducts = useCallback(async () => {
        if (!user?.id) return;
        
        setIsLoading(true);
        setError(null);
        try {
        const response = await productApi.get(`/seller/${user.id}`);
        setProducts(response.data.data);
        } catch (err) {
        console.error("Gagal mengambil produk:", err);
        setError(err.response?.data?.message || 'Gagal memuat data produk.');
        } finally {
        setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleOpenCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null)
    };

    const handleSaveProduct = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        try {
        if (editingProduct) {
            await productApi.put(`/update/${editingProduct.id}`, formData);
        } else {
            await productApi.post('/create', formData);
        }
        fetchProducts();
        handleCloseModal();
        } catch (err) {
        console.error("Gagal menyimpan produk:", err);
        setError(err.response?.data?.message || 'Gagal menyimpan produk.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (!window.confirm(`Yakin ingin menghapus produk "${productName}"?`)) return;
        
        setIsLoading(true);
        setError(null);
        try {
        await productApi.delete(`/delete/${productId}`);
        fetchProducts();
        } catch (err) {
        console.error("Gagal menghapus produk:", err);
        setError(err.response?.data?.message || 'Gagal menghapus produk.');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
        <Header />
        
        <main className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
            {/* Dashboard Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-extrabold text-brand-dark">
                Manajemen Produk
            </h1>
            <button
                onClick={handleOpenCreateModal}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-green text-white font-medium px-5 py-3 rounded-lg shadow hover:bg-green-600 transition-colors"
            >
                <HiPlus size={20} />
                Tambah Produk Baru
            </button>
            </div>

            {/* Global Error Notification */}
            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
            )}

            {/* Main Content (Table)  */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
            {isLoading ? (
                <div className="text-center py-10">Memuat produk...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                Anda belum memiliki produk. Silakan "Tambah Produk Baru".
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diskon</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{product.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{product.discount}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                            onClick={() => handleOpenEditModal(product)}
                            className="text-brand-pink hover:text-pink-400 p-2"
                            aria-label="Edit"
                            >
                            <HiOutlinePencil size={18} />
                            </button>
                            <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-gray-400 hover:text-red-500 p-2"
                            aria-label="Hapus"
                            >
                            <HiOutlineTrash size={18} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </main>

        {/* Capital for Create/Edit */}
        <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        >
            {/* Error Form Notification (if an error occurs during submission) */}
            {error && isSubmitting && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                {error}
            </div>
            )}
            <ProductForm 
            initialData={editingProduct}
            onSubmit={handleSaveProduct}
            isLoading={isSubmitting}
            />
        </Modal>
        </div>
    );
};

export default DashboardPage;