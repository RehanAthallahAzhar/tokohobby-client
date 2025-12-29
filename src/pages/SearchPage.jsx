import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../services/api";
import ProductCard from "../components/ProductCard"; // Impor kartu produk Anda
import { HiOutlineSearchCircle } from "react-icons/hi";
import Header from "../components/Header";

import EmptyState from '../components/EmptyState';

const FilterSidebar = () => {
  return (
    <aside className="w-full space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Filter</h3>
        <div>
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Jenis Toko</h4>
          <div className="space-y-1">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded text-cyan-600" />
              <span className="ml-2">Official Store</span>
            </label>
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded text-cyan-600" />
              <span className="ml-2">Power Merchant</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Lokasi</h4>
          <div className="space-y-1">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded text-cyan-600" />
              <span className="ml-2">Jabodetabek</span>
            </label>
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" className="rounded text-cyan-600" />
              <span className="ml-2">Bandung</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Main Search Page Components
const SearchPage = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsBySearch = async () => {
      setLoading(true);
      setError(null);
      setProducts([]);
      try {
        const response = await productApi.get(`/name/${query}`);
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

  const renderProductList = () => {
    if (loading) {
      return (
        <div className="col-span-12 text-center py-10">
          <p className="text-gray-600">Mencari produk...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-12 text-center py-10 bg-red-100 text-red-700 rounded-lg">
          <p>
            <strong>Oops! Terjadi kesalahan:</strong> {error}
          </p>
        </div>
      );
    }

    if (!loading && products.length === 0) {
      return (
        <div className="col-span-12">
          <EmptyState
            icon={HiOutlineSearchCircle}
            title="Yah, Produk Tidak Ditemukan!"
            message={`Kami tidak menemukan produk yang cocok dengan pencarian "${query}". Coba kata kunci lain.`}
            linkTo="/"
            linkText="Kembali ke Beranda"
          />
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
        <Header />
      {/* 2 Column Layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Sidebar Filter */}
        <div className="w-full md:w-1/4">
          <FilterSidebar />
        </div>

        {/* Right Column: Title & Product Grid */}
        <div className="w-full md:w-3/4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-1">
            Menampilkan hasil untuk{" "}
            <span className="text-cyan-600 dark:text-cyan-400">"{query}"</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Total {products.length} produk ditemukan
          </p>

          {/* Product/Store Tab - Placeholder */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <span className="py-2 px-4 border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
              Produk
            </span>
            <span className="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium text-sm">
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
