import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { cartApi, productApi } from '../services/api';
import Header from '../components/Header';
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
        await cartApi.post(`/add/${id}`, {
            quantity: quantity,
            description: cartNote,
        });
        setCartMessage({ type: 'success', text: 'Produk berhasil ditambahkan ke keranjang!' });
        fetchCart();
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

    if (error || !product) {
        return (
        <div>
            <div className="container mx-auto max-w-7xl px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Oops! Terjadi Kesalahan</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error || 'Produk tidak dapat ditemukan.'}</p>
            <Link to="/" className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">
                Kembali ke Beranda
            </Link>
            </div>
        </div>
        );
    }

    const finalPrice = calculateDiscountedPrice(product.price, product.discount);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Breadcrumb Navigation */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto max-w-7xl px-4 py-4">
                    <button
                        onClick={() => navigate(-1)} 
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group"
                    >
                        <HiOutlineChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Kembali
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Left: Product Image with Gallery */}
                    <div className="space-y-4 animate-fade-in">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl group">
                            <img
                                src={`https://placehold.co/800x800/E0F2E9/333333?text=${product.name}`}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Discount Badge */}
                            {product.discount > 0 && (
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-lg opacity-75 animate-pulse"></div>
                                        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg font-black px-5 py-2.5 rounded-2xl shadow-xl">
                                            {product.discount}% OFF
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stock Badge */}
                            {product.stock < 10 && product.stock > 0 && (
                                <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                    Hanya {product.stock} tersisa!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info & Actions */}
                    <div className="flex flex-col space-y-6 animate-fade-in [animation-delay:200ms]">
                        {/* Category Badge */}
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-4 py-2 rounded-full border border-cyan-200 dark:border-cyan-800">
                                {product.type}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Stok: <span className="font-bold text-gray-900 dark:text-white">{product.stock}</span>
                            </span>
                        </div>

                        {/* Product Title */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-3">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-cyan-200 dark:border-gray-700">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-5xl font-black text-cyan-600 dark:text-cyan-400">
                                    {formatCurrency(finalPrice)}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-2xl text-gray-400 dark:text-gray-500 line-through">
                                        {formatCurrency(product.price)}
                                    </span>
                                )}
                            </div>
                            {product.discount > 0 && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Hemat {formatCurrency(product.price - finalPrice)}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                📝 Deskripsi Produk
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        {/* Purchase Section */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 shadow-lg space-y-5">
                            {cartMessage && (
                                <div className={`p-4 rounded-xl text-sm font-medium animate-scale-in ${
                                    cartMessage.type === 'success' 
                                    ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' 
                                    : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
                                }`}>
                                    {cartMessage.text}
                                </div>
                            )}
                            
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Kuantitas:</label>
                                <QuantitySpinner 
                                    quantity={quantity} 
                                    setQuantity={setQuantity} 
                                    maxStock={product.stock}
                                />
                            </div>
                            
                            <input
                                type="text"
                                value={cartNote}
                                onChange={(e) => setCartNote(e.target.value)}
                                placeholder="Catatan (opsional, cth: 'wrapnya yg tebal ya')"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || product.stock === 0}
                                className="group w-full relative flex items-center justify-center gap-3 py-5 px-8 border-none rounded-2xl text-lg font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                            >
                                {/* Button shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                
                                {isAddingToCart ? (
                                    <>
                                        <LoadingSpinner />
                                        <span className="relative">Menambahkan...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineShoppingCart size={24} className="relative" />
                                        <span className="relative">Tambah ke Keranjang</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )}

export default ProductDetailPage;
