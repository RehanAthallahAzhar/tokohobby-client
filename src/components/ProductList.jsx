import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await productApi.get('/');
            setProducts(response.data.data);
        } catch (err) {
            setError(err.message || 'Gagal mengambil data produk.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
        <div className="text-center py-10">
            <p>Loading products...</p>
        </div>
        );
    }

    // Error
    if (error) {
        return (
        <div className="text-center py-10 bg-red-100 text-red-700 rounded-lg">
            <p><strong>Error:</strong> {error}</p>
        </div>
        );
    }

    return (
        <section className="container mx-auto max-w-7xl px-4 mt-12 mb-20 animate-fade-in [animation-delay:400ms]">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Most Popular</h2>
            <a href="#" className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
            Show All
            </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </section>
    );
};

export default ProductList;