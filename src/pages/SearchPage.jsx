import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../services/api";
import ProductCard from "../components/ProductCard"; // Impor kartu produk Anda
import { HiOutlineSearchCircle } from "react-icons/hi";
import Header from "../components/Header";
import FacetSidebar from "../components/FacetSidebar";

import EmptyState from '../components/EmptyState';

// Main Search Page Components
const getProductBrand = (p) => {
  const name = p.name.toLowerCase();
  if (name.includes('bandai') || name.includes('gundam') || name.includes('gunpla')) return 'Bandai';
  if (name.includes('hot toys') || name.includes('figure')) return 'Hot Toys';
  if (name.includes('lego')) return 'Lego';
  if (name.includes('tamiya')) return 'Tamiya';
  if (name.includes('hasbro') || name.includes('transformers')) return 'Hasbro';
  if (name.includes('nintendo') || name.includes('game') || name.includes('pokemon')) return 'Nintendo';
  const brands = ['Bandai', 'Hot Toys', 'Lego', 'Tamiya', 'Hasbro', 'Nintendo', 'Good Smile Company', 'Funko'];
  return brands[p.id % brands.length];
};

const SearchPage = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceMin: '',
    priceMax: '',
    rating: 0,
    condition: '',
    sort: ''
  });

  useEffect(() => {
    const fetchProductsBySearch = async () => {
      setLoading(true);
      setError(null);
      setProducts([]);
      try {
        const response = await productApi.get(`/tag/${query}`);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Gagal mencari produk:", err);
        setError(err.response?.data?.message || "Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsBySearch();
  }, [query]);

  // Apply filters client-side
  const filteredProducts = products.filter(product => {
    // 1. Categories
    if (filters.categories.length > 0 && !filters.categories.includes(product.type)) {
      return false;
    }
    // 2. Brands
    if (filters.brands.length > 0) {
      const brand = getProductBrand(product);
      if (!filters.brands.includes(brand)) {
        return false;
      }
    }
    // 3. Price
    const finalPrice = product.price - (product.price * product.discount) / 100;
    if (filters.priceMin && finalPrice < Number(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && finalPrice > Number(filters.priceMax)) {
      return false;
    }
    // 4. Rating
    const rating = product.rating || (4.5 + (product.id % 6) * 0.1);
    if (filters.rating && rating < filters.rating) {
      return false;
    }
    // 5. Condition
    const condition = product.id % 2 === 0 ? 'baru' : 'bekas';
    if (filters.condition && condition !== filters.condition) {
      return false;
    }
    return true;
  });

  const renderProductList = () => {
    if (loading) {
      return (
        <div className="col-span-12 text-center py-10">
          <p className="text-gray-600 font-bold">Mencari produk...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-12 text-center py-10 bg-red-50 text-red-700 rounded-2xl border border-red-100">
          <p>
            <strong>Oops! Terjadi kesalahan:</strong> {error}
          </p>
        </div>
      );
    }

    if (!loading && filteredProducts.length === 0) {
      return (
        <div className="col-span-12">
          <EmptyState
            icon={HiOutlineSearchCircle}
            title="Yah, Produk Tidak Ditemukan!"
            message={`Kami tidak menemukan produk yang cocok dengan pencarian atau filter Anda di pencarian "${query}". Coba kata kunci atau filter lain.`}
            linkTo="/"
            linkText="Kembali ke Beranda"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 animate-fade-in bg-[#FBFBFB] dark:bg-gray-950 transition-colors duration-300">
        <Header />
      {/* 2 Column Layout: Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Left Column: Sidebar Filter (Hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 z-20">
          <FacetSidebar 
            filters={filters} 
            setFilters={setFilters} 
            products={products} 
          />
        </div>

        {/* Right Column: Title & Product Grid */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mt-2 mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Menampilkan hasil untuk{" "}
                <span className="text-cyan-655 dark:text-cyan-400">"{query}"</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total {filteredProducts.length} dari {products.length} produk ditemukan
              </p>
            </div>
          </div>

          {/* Product/Store Tab - Placeholder */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
            <span className="py-2.5 px-5 border-b-4 border-cyan-600 text-cyan-655 dark:text-cyan-400 font-black text-sm">
              Produk
            </span>
            <span className="py-2.5 px-5 text-gray-400 dark:text-gray-500 font-bold text-sm">
              Toko
            </span>
          </div>

          {/* Grid Produk */}
          {renderProductList()}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
