import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineFire, HiOutlineHeart, HiHeart, HiStar } from 'react-icons/hi';

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

const getHashCode = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const getProductImage = (product) => {
  const name = product.name.toLowerCase();
  const hash = getHashCode(product.id || '');
  if (name.includes('gundam') || name.includes('gunpla') || name.includes('model kit') || name.includes('skala')) {
    const kitImages = [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=400'
    ];
    return kitImages[hash % kitImages.length];
  }
  if (name.includes('figure') || name.includes('action figure') || name.includes('nendoroid') || name.includes('koleksi') || name.includes('scale')) {
    const figureImages = [
      'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&q=80&w=400'
    ];
    return figureImages[hash % figureImages.length];
  }
  if (name.includes('game') || name.includes('puzzle') || name.includes('boardgame') || name.includes('kartu')) {
    const gameImages = [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1606500465376-138a291393a4?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=400'
    ];
    return gameImages[hash % gameImages.length];
  }
  return `https://picsum.photos/id/${(hash % 800) + 100}/400/400`;
};

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const finalPrice = calculateDiscountedPrice(product.price, product.discount);
  const isLowStock = product.stock < 10 && product.stock > 0;
  
  const rating = product.rating || (4.5 + (getHashCode(product.id || '') % 6) * 0.1).toFixed(1);
  const minOrder = formatCurrency(Math.max(50000, Math.round(product.price / 100000) * 20000));

  const handleWishlistToggle = (e) => {
    e.preventDefault(); 
    setIsWishlisted(!isWishlisted);
  };

  const productImage = getProductImage(product);

  return (
    <div className="bg-white dark:bg-gray-900 relative rounded-2xl sm:rounded-[2.2rem] p-2 sm:p-3.5 border border-cyan-50/50 sm:border-2 dark:border-gray-800/80 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block">
        
        {/* Product Image Container */}
        <div className="aspect-[4/3] sm:aspect-square bg-cyan-50/20 dark:bg-gray-850 rounded-xl sm:rounded-[1.8rem] overflow-hidden relative border border-cyan-50/50 dark:border-gray-800">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Wishlist Button Overlay */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-20 bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-800 p-1.5 sm:p-2.5 rounded-full shadow-md text-gray-500 hover:text-red-500 active:scale-90 transition-all cursor-pointer border-0 outline-none"
            aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          >
            {isWishlisted ? (
              <HiHeart className="text-red-500 animate-scale-in w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
            ) : (
              <HiOutlineHeart className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
            )}
          </button>
 
          {/* Sold Out Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-red-500 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full font-black text-[10px] sm:text-xs shadow-md">
                HABIS
              </span>
            </div>
          )}
 
          {/* Quick View Cart Hint */}
          {product.stock > 0 && (
            <div className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
              <div className="bg-cyan-600 text-white p-1.5 sm:p-2.5 rounded-full shadow-lg hover:bg-cyan-700 transition-colors">
                <HiOutlineShoppingCart size={15} className="sm:size-[18px]" />
              </div>
            </div>
          )}
        </div>
 
        {/* Product Info Section */}
        <div className="p-1 sm:p-3.5 space-y-1">
          {/* Carousel Slide Indicators - Hidden on Mobile */}
          <div className="hidden sm:flex justify-center gap-1 mt-0.5 mb-2.5 opacity-55 group-hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          </div>
 
          {/* Rating and Minimum Order - Condensed on Mobile */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-bold">
            <div className="flex items-center text-amber-500">
              <HiStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
              <span className="ml-0.5 text-gray-900 dark:text-white font-black">{rating}</span>
            </div>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
            <span className="hidden sm:inline">Min. {minOrder.replace(',00', '')}</span>
          </div>
 
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold sm:font-black text-gray-900 dark:text-gray-150 line-clamp-1 group-hover:text-cyan-650 transition-colors" title={product.name}>
            {product.name}
          </h3>
 
          {/* Price */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="text-sm sm:text-base font-black text-cyan-650 dark:text-cyan-400">
              {formatCurrency(finalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
 
          {/* Active Capsule Badges - Size reduced for mobile */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.discount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100">
                {product.discount}% OFF
              </span>
            ) : product.id % 2 === 0 ? (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-100/50">
                New
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/20 text-cyan-750 dark:text-cyan-400 border border-cyan-100">
                Top
              </span>
            )}
            
            {isLowStock && (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 flex items-center gap-0.5">
                Sisa {product.stock}!
              </span>
            )}
          </div>
        </div>
 
      </Link>
    </div>
  );
};

export default ProductCard;
