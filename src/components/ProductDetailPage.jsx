import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { cartApi, productApi } from '../services/api';

import QuantitySpinner from '../components/QuantitySpinner';
import { HiOutlineChevronLeft, HiOutlineShoppingCart } from 'react-icons/hi';
import LoadingSpinner from '../components/LoadingSpinner'; 
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth'; 

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
};


const ProductDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { fetchCart } = useCart();
    const { token } = useAuth();
    const location = useLocation(); 

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1); 
    const [cartNote, setCartNote] = useState('');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState(null); 

    useEffect(() => {
        const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await productApi.get(`/${id}`);
            setProduct(response.data.data);
        } catch (err) {
            console.error("Gagal mengambil produk:", err);
            setError(err.response?.data?.message || 'Produk tidak ditemukan.');
        } finally {
            setIsLoading(false);
        }
        };

        fetchProduct();
    }, [id]); 

    const handleAddToCart = async () => {
        
        if (!token) {
            navigate('/login', { state: { from: location } });
            return; 
        }

        setIsAddingToCart(true);
        setCartMessage(null);
        try {
        await cartApi.post(`/${id}`, {
            quantity: quantity,
            description: cartNote || ' ',
        });
        setCartMessage({ type: 'success', text: 'Produk berhasil ditambahkan ke keranjang!' });
        fetchCart({ showLoading: false });
        setQuantity(1);
        setCartNote('');
        } catch (err) {
        console.error("Gagal menambah ke keranjang:", err);
        setCartMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menambahkan produk.' });
        } finally {
        setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return (
        <div>
            <div className="flex h-[50vh] items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            </div>
        </div>
        );
    }

    // Error
    if (error || !product) {
        return (
        <div>
            <div className="container mx-auto max-w-7xl px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Terjadi Kesalahan</h2>
            <p className="text-gray-700 mb-6">{error || 'Produk tidak dapat ditemukan.'}</p>
            <Link to="/" className="text-cyan-600 font-medium hover:underline">
                Kembali ke Beranda
            </Link>
            </div>
        </div>
        );
    }

    // Success
    const finalPrice = calculateDiscountedPrice(product.price, product.discount);

    return (
        <main className="container mx-auto max-w-7xl px-4 mt-8 animate-fade-in">
            <button
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-cyan-600 mb-6 transition-colors"
            >
            <HiOutlineChevronLeft size={18} />
            Kembali
            </button>

            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
s               <img
                    src={`https://placehold.co/600x600/E0F2E9/333333?text=${product.name}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                </div>

                <div className="flex flex-col space-y-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-white bg-cyan-600 px-3 py-1 rounded-full capitalize">
                    {product.type}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                    Stok: <span className="text-gray-900 font-bold">{product.stock}</span>
                    </span>
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-cyan-600">
                    {formatCurrency(finalPrice)}
                    </span>
                    {product.discount > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                        {formatCurrency(product.price)}
                </span>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Produk</h3>
                    <p className="text-gray-600 leading-relaxed">
                    {product.description}
                    </p>
                </div>

                <hr className="border-gray-200" />

            <div className="space-y-4">
                    {cartMessage && (
                    <div className={`p-4 rounded-lg text-sm ${
                        cartMessage.type === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                        {cartMessage.text}
                    </div>
                    )}
                    <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Kuantitas:</span>
                    
                    <QuantitySpinner 
                        quantity={quantity} 
                        setQuantity={setQuantity} 
                        maxStock={product.stock}
                        minStock={1}
                    />
                    </div>
                    
                    <input
                    type="text"
                    value={cartNote}
                    onChange={(e) => setCartNote(e.target.value)}
                    placeholder="Catatan (opsional, cth: 'wrapnya yg tebal ya')"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                    />

                    <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock === 0}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isAddingToCart ? (
                        <>
                        <LoadingSpinner />
                            Menambahkan...
                        </>
                    ) : (
                        <>
                        <HiOutlineShoppingCart size={20} />
                        Tambah ke Keranjang
                        </>
                    )}
                    </button>
                </div>

                </div>
            </div>
            </div>
        </main>
    );
};

export default ProductDetailPage;




