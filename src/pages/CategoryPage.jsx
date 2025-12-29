import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard'; 
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { getCategoryBySlug } from '../data/categories';


const CategoryHero = ({ category }) => {
    const categoryName = category?.name || 'Kategori';
    const heroImage = category?.heroImage || 'https://placehold.co/600x400/93c5fd/374151?text=Kategori';

    return (
        <section 
        className="w-full bg-gradient-to-r from-blue-100 via-white to-cyan-100 p-8 md:p-12 rounded-2xl shadow-lg mb-12"
        >
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
            {/* left: Text */}
            <div>
            <p className="text-sm font-medium text-cyan-700">Menampilkan Kategori</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mt-2 capitalize">
                {categoryName}
            </h1>
            <p className="text-lg text-gray-600 mt-4">
                Temukan semua produk terbaik untuk hobi Anda dalam kategori {categoryName}.
            </p>
            </div>
            
            <div className="hidden md:block h-48 md:h-64"> 
            <img 
                src={heroImage} 
                alt={categoryName}
                className="rounded-lg object-contain w-full h-full"
            />
            </div>

        </div>
        </section>
    );
};

const CategoryPage = () => {
    const { slug } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const category = getCategoryBySlug(slug);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            setError("Kategori tidak valid.");
            return;
        }

        const fetchProductsByCategory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.get(`/category/${slug}`);
            setProducts(response.data.data || []); 
        } catch (err) {
            console.error("Gagal mengambil produk berdasarkan kategori:", err);
            setError(err.response?.data?.message || 'Gagal memuat produk.');
        } finally {
            setLoading(false);
        }
        };

        fetchProductsByCategory();
    }, [slug]); 

    if (!category) {
        return <Navigate to="/404" replace />; 
    }

    const renderProductList = () => {
        if (loading) {
        return (
            <div className="text-center py-10">
            <p className="text-gray-600">Memuat produk...</p>
            </div>
        );
        }

        if (error) {
        return (
            <div className="text-center py-10 bg-red-100 text-red-700 rounded-lg">
            <p><strong>Oops! Terjadi kesalahan:</strong> {error}</p>
            </div>
        );
        }

        if (!loading && products.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="text-lg font-medium text-gray-700">Yah, belum ada produk!</p>
            <p className="text-gray-500 mt-2">Belum ada produk yang ditemukan untuk kategori "{category.name}".</p>
            </div>
        );
        }

        return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        );
    };

    return (
        <main className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in">
        
        <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 dark:text-white hover:text-cyan-800 dark:hover:text-cyan-400 mb-6 transition-colors"
        >
            <HiOutlineArrowLeft size={18} />
            Kembali ke Beranda
        </Link>

        <CategoryHero category={category} />

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Menampilkan Produk untuk "{category.name}"
        </h2>

        {renderProductList()}

        </main>
    );
};

export default CategoryPage;