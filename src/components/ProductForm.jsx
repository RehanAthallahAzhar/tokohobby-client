import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        stock: 0,
        discount: 0,
        type: 'food',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
        setFormData({
            name: initialData.name,
            price: initialData.price,
            stock: initialData.stock,
            discount: initialData.discount,
            type: initialData.type,
            description: initialData.description,
        });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
            <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            >
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="other">Other</option>
            </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga (IDR)</label>
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stok</label>
            <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Diskon (%)</label>
            <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
        </div>

        <div className="flex justify-end pt-4">
            <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50"
            >
            {isLoading ? <LoadingSpinner /> : (initialData ? 'Update Produk' : 'Simpan Produk Baru')}
            </button>
        </div>
        </form>
    );
};

export default ProductForm;