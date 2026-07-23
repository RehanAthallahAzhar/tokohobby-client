import React, { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/api';
import ProductCard from './ProductCard';

const PAGE_SIZE = 20;

const hashCode = (str = '') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
};

const getProductBrand = (p) => {
    const name = (p.name || '').toLowerCase();
    if (name.includes('bandai') || name.includes('gundam') || name.includes('gunpla')) return 'Bandai';
    if (name.includes('hot toys') || name.includes('figure')) return 'Hot Toys';
    if (name.includes('lego')) return 'Lego';
    if (name.includes('tamiya')) return 'Tamiya';
    if (name.includes('hasbro') || name.includes('transformers')) return 'Hasbro';
    if (name.includes('nintendo') || name.includes('game') || name.includes('pokemon')) return 'Nintendo';
    const brands = ['Bandai', 'Hot Toys', 'Lego', 'Tamiya', 'Hasbro', 'Nintendo', 'Good Smile Company', 'Funko'];
    return brands[hashCode(p.id || '') % brands.length];
};

const ProductList = ({ filters, onLoaded }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchProducts = useCallback(async (pageNum) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await productApi.get(`/?page=${pageNum}&size=${PAGE_SIZE}`);
            const body = response?.data;

            // Handle both paginated shape {data, paging} and legacy shape {data: [...]}
            let dataArray = [];
            if (body?.paging) {
                // New paginated response
                dataArray = Array.isArray(body.data) ? body.data : [];
                setTotalPages(body.paging.total_pages || 1);
                setTotalItems(body.paging.total_items || dataArray.length);
            } else {
                // Legacy: all products in body.data
                dataArray = Array.isArray(body?.data) ? body.data : [];
                setTotalPages(1);
                setTotalItems(dataArray.length);
            }

            setProducts(dataArray);
            if (onLoaded) onLoaded(dataArray);
        } catch (err) {
            setError(err.message || 'Gagal mengambil data produk.');
            console.error('Failed to fetch products:', err);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [onLoaded]);

    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

    const goToPage = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ---- Filter logic ----
    const filteredProducts = products.filter(product => {
        if (filters?.categories?.length > 0 && !filters.categories.includes(product.type)) return false;
        if (filters?.brands?.length > 0 && !filters.brands.includes(getProductBrand(product))) return false;
        const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;
        if (filters?.priceMin && finalPrice < Number(filters.priceMin)) return false;
        if (filters?.priceMax && finalPrice > Number(filters.priceMax)) return false;
        const rating = product.rating || (4.5 + (hashCode(product.id || '') % 6) * 0.1);
        if (filters?.rating && rating < filters.rating) return false;
        const condition = hashCode(product.id || '') % 2 === 0 ? 'baru' : 'bekas';
        if (filters?.condition && condition !== filters.condition) return false;
        return true;
    });

    // ---- Pagination button builder ----
    // Always show: first, last, current, and 2 neighbours. Use ellipsis for gaps.
    const buildPages = () => {
        if (totalPages <= 1) return [];
        const pages = [];
        const addPage = (n) => { if (n >= 0 && n < totalPages && !pages.includes(n)) pages.push(n); };

        addPage(0);
        for (let i = page - 2; i <= page + 2; i++) addPage(i);
        addPage(totalPages - 1);

        pages.sort((a, b) => a - b);
        return pages;
    };

    const pages = buildPages();

    // ---- Render ----
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                <p><strong>Error:</strong> {error}</p>
            </div>
        );
    }

    return (
        <section className="animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">Most Popular</h2>
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                    {totalItems.toLocaleString()} produk
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-900/40 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
                        <p className="font-bold text-lg mb-1">Tidak ada produk yang cocok</p>
                        <p className="text-sm">Silakan ubah rentang harga atau kurangi filter Anda.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-10 flex-wrap select-none">
                    {/* Prev */}
                    <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 0}
                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                        aria-label="Halaman sebelumnya"
                    >
                        ‹
                    </button>

                    {/* Page numbers with ellipsis */}
                    {pages.map((p, idx) => {
                        const showEllipsisBefore = idx > 0 && p - pages[idx - 1] > 1;
                        return (
                            <React.Fragment key={p}>
                                {showEllipsisBefore && (
                                    <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                )}
                                <button
                                    onClick={() => goToPage(p)}
                                    className={`w-9 h-9 rounded-full border text-sm font-bold transition-all duration-200 ${
                                        p === page
                                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-200 dark:shadow-cyan-900 scale-110'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-cyan-600 hover:text-white hover:border-cyan-600'
                                    }`}
                                    aria-label={`Halaman ${p + 1}`}
                                    aria-current={p === page ? 'page' : undefined}
                                >
                                    {p + 1}
                                </button>
                            </React.Fragment>
                        );
                    })}

                    {/* Next */}
                    <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                        aria-label="Halaman berikutnya"
                    >
                        ›
                    </button>

                    {/* Page info */}
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Hal. {page + 1} / {totalPages}
                    </span>
                </div>
            )}
        </section>
    );
};

export default ProductList;