import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineFire } from 'react-icons/hi';

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

const ProductCard = ({ product }) => {
    const finalPrice = calculateDiscountedPrice(product.price, product.discount);
    const isLowStock = product.stock < 10 && product.stock > 0;

    return (
        <div className="bg-white dark:bg-gray-900 relative rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30 group border border-gray-200 dark:border-gray-700 hover:-translate-y-3 hover:rotate-[0.5deg]">
        <Link to={`/product/${product.id}`} className="block">
            {/* Gambar Produk */}
            <div className="aspect-square bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
            <img
                src={`https://placehold.co/400x400/E0F2E9/333333?text=${product.name.split(' ')[0]}`}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
            />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/40 via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Quick view hint on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2">
                    <HiOutlineShoppingCart className="text-cyan-600 dark:text-cyan-400" size={20} />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Lihat Detail</span>
                </div>
            </div>
            </div>

            {/* Product Info */}
            <div className="p-4 relative">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1" title={product.name}>
                {product.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-3 flex items-center gap-1">
                {product.type}
                {isLowStock && (
                    <span className="ml-auto flex items-center gap-1 text-orange-500 dark:text-orange-400 font-medium animate-pulse">
                        <HiOutlineFire size={14} />
                        {product.stock} left!
                    </span>
                )}
            </p>
            
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300 inline-block">
                {formatCurrency(finalPrice)}
                </span>
                {product.discount > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                    {formatCurrency(product.price)}
                </span>
                )}
            </div>
            
            {/* Stock info */}
            <div className="text-xs text-gray-400 dark:text-gray-500">
                Stock: <span className="font-medium text-gray-600 dark:text-gray-400">{product.stock}</span>
            </div>
            </div>
            
            {/* Badges */}
            {product.discount > 0 && (
                <div className="absolute top-3 right-3 z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-md opacity-75 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            {product.discount}% OFF
                        </div>
                    </div>
                </div>
            )}
            
            {product.stock === 0 && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl">
                        SOLD OUT
                    </div>
                </div>
            )}
        </Link>
        </div>
    );
};

export default ProductCard;
