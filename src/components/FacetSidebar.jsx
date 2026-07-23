import React, { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineX, HiStar } from 'react-icons/hi';

const BRANDS = ['Bandai', 'Hot Toys', 'Lego', 'Tamiya', 'Hasbro', 'Nintendo', 'Good Smile Company', 'Funko'];

const FacetSidebar = ({ 
  filters = { categories: [], brands: [], priceMin: '', priceMax: '', rating: 0, condition: '' }, 
  setFilters = () => {}, 
  products = [] 
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    ratings: true,
    condition: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const categoryCounts = {};
  const brandCounts = {};
  products.forEach(p => {
    categoryCounts[p.type] = (categoryCounts[p.type] || 0) + 1;
    const brand = getProductBrand(p);
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  const handleCategoryChange = (slug) => {
    setFilters(prev => {
      const categories = prev.categories.includes(slug)
        ? prev.categories.filter(c => c !== slug)
        : [...prev.categories, slug];
      return { ...prev, categories };
    });
  };

  const handleBrandChange = (brandName) => {
    setFilters(prev => {
      const brands = prev.brands.includes(brandName)
        ? prev.brands.filter(b => b !== brandName)
        : [...prev.brands, brandName];
      return { ...prev, brands };
    });
  };

  const handlePriceChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (val) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === val ? 0 : val }));
  };

  const handleConditionChange = (cond) => {
    setFilters(prev => ({ ...prev, condition: prev.condition === cond ? '' : cond }));
  };

  const resetAll = () => {
    setFilters({
      categories: [],
      brands: [],
      priceMin: '',
      priceMax: '',
      rating: 0,
      condition: '',
      sort: ''
    });
  };

  const categoriesList = [
    { name: 'Action Figure', slug: 'action-figure' },
    { name: 'Sport', slug: 'sport' },
    { name: 'Games & Puzzles', slug: 'games-puzzles' },
    { name: 'Clothes & Footwear', slug: 'clothes-footwear' },
    { name: 'Model Kits', slug: 'model-kits' },
    { name: 'Art & Craft', slug: 'art-craft' },
    { name: 'Music', slug: 'music' },
    { name: 'Photography', slug: 'photography' },
    { name: 'Books & Comics', slug: 'books-comics' },
    { name: 'Collectibles', slug: 'collectibles' }
  ];

  return (
    <aside className="w-full space-y-6">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-[2rem] p-6 shadow-md border border-cyan-100/50 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-4 mb-5">
          <span className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-100">
            SARING
          </span>
          <button 
            onClick={resetAll}
            className="text-xs font-black text-red-500 hover:text-red-650 flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-0 outline-none"
          >
            reset <HiOutlineX size={14} className="inline" />
          </button>
        </div>

        {(filters.categories.length > 0 || filters.brands.length > 0 || filters.priceMin || filters.priceMax || filters.rating > 0 || filters.condition) && (
          <div className="flex flex-wrap gap-1.5 mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
            {filters.categories.map(c => (
              <span key={c} className="text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-150 dark:border-cyan-850 px-2.5 py-1 rounded-full flex items-center gap-1">
                {categoriesList.find(cat => cat.slug === c)?.name || c}
                <HiOutlineX size={10} className="cursor-pointer text-cyan-600 dark:text-cyan-400" onClick={() => handleCategoryChange(c)} />
              </span>
            ))}
            {filters.brands.map(b => (
              <span key={b} className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-150 dark:border-amber-850 px-2.5 py-1 rounded-full flex items-center gap-1">
                {b}
                <HiOutlineX size={10} className="cursor-pointer text-amber-600 dark:text-amber-400" onClick={() => handleBrandChange(b)} />
              </span>
            ))}
            {(filters.priceMin || filters.priceMax) && (
              <span className="text-[10px] font-bold bg-green-50 dark:bg-green-950/80 text-green-600 dark:text-green-400 border border-green-150 dark:border-green-850 px-2.5 py-1 rounded-full flex items-center gap-1">
                Harga
                <HiOutlineX size={10} className="cursor-pointer text-green-600 dark:text-green-400" onClick={() => setFilters(prev => ({ ...prev, priceMin: '', priceMax: '' }))} />
              </span>
            )}
            {filters.rating > 0 && (
              <span className="text-[10px] font-bold bg-yellow-50 dark:bg-yellow-950/80 text-yellow-600 dark:text-yellow-400 border border-yellow-150 dark:border-yellow-850 px-2.5 py-1 rounded-full flex items-center gap-1">
                {filters.rating}+ Star
                <HiOutlineX size={10} className="cursor-pointer text-yellow-600 dark:text-yellow-400" onClick={() => handleRatingChange(filters.rating)} />
              </span>
            )}
            {filters.condition && (
              <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-850 px-2.5 py-1 rounded-full flex items-center gap-1">
                {filters.condition === 'baru' ? 'Baru' : 'Bekas'}
                <HiOutlineX size={10} className="cursor-pointer text-indigo-600 dark:text-indigo-400" onClick={() => handleConditionChange(filters.condition)} />
              </span>
            )}
          </div>
        )}

        <div className="border-b border-gray-150 dark:border-gray-800 pb-5 mb-5">
          <button 
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3 cursor-pointer bg-transparent border-0 outline-none"
          >
            <span>KATEGORI</span>
            {openSections.categories ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </button>
          {openSections.categories && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500">
              {categoriesList.map((cat) => {
                const count = categoryCounts[cat.slug] || 0;
                const isChecked = filters.categories.includes(cat.slug);
                return (
                  <label key={cat.slug} className="flex items-center justify-between cursor-pointer select-none group text-xs text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-0.5">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer bg-transparent" 
                      />
                      <span className={`font-semibold ${isChecked ? 'text-cyan-655 dark:text-cyan-400' : ''}`}>{cat.name}</span>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500 font-bold">{count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-b border-gray-150 dark:border-gray-800 pb-5 mb-5">
          <button 
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3 cursor-pointer bg-transparent border-0 outline-none"
          >
            <span>BRAND / MERK</span>
            {openSections.brands ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </button>
          {openSections.brands && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500">
              {BRANDS.map((brand) => {
                const count = brandCounts[brand] || 0;
                const isChecked = filters.brands.includes(brand);
                return (
                  <label key={brand} className="flex items-center justify-between cursor-pointer select-none group text-xs text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-0.5">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleBrandChange(brand)}
                        className="rounded border-gray-300 dark:border-gray-600 text-cyan-600 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer bg-transparent" 
                      />
                      <span className={`font-semibold ${isChecked ? 'text-cyan-655 dark:text-cyan-400' : ''}`}>{brand}</span>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500 font-bold">{count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-b border-gray-150 dark:border-gray-800 pb-5 mb-5">
          <button 
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3 cursor-pointer bg-transparent border-0 outline-none"
          >
            <span>RENTANG HARGA</span>
            {openSections.price ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </button>
          {openSections.price && (
            <div className="space-y-3 animate-scale-in">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input 
                    type="number" 
                    placeholder="Min (Rp)" 
                    value={filters.priceMin}
                    onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-cyan-500 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Max (Rp)" 
                    value={filters.priceMax}
                    onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-cyan-500 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-gray-150 dark:border-gray-800 pb-5 mb-5">
          <button 
            onClick={() => toggleSection('ratings')}
            className="flex items-center justify-between w-full text-left font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3 cursor-pointer bg-transparent border-0 outline-none"
          >
            <span>RATING</span>
            {openSections.ratings ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </button>
          {openSections.ratings && (
            <div className="space-y-2 animate-scale-in">
              {[5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg w-full text-left transition-all border outline-none cursor-pointer ${
                    filters.rating === rating 
                      ? 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-650 dark:text-cyan-400 font-bold border-cyan-200 dark:border-cyan-900/50' 
                      : 'text-gray-600 dark:text-gray-300 bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} size={14} className={i < rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                  <span>{rating === 5 ? '5 Bintang' : `${rating} Bintang ke Atas`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <button 
            onClick={() => toggleSection('condition')}
            className="flex items-center justify-between w-full text-left font-black text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-3 cursor-pointer bg-transparent border-0 outline-none"
          >
            <span>KONDISI BARANG</span>
            {openSections.condition ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </button>
          {openSections.condition && (
            <div className="flex gap-2.5 animate-scale-in">
              {['baru', 'bekas'].map((cond) => {
                const isSelected = filters.condition === cond;
                return (
                  <button
                    key={cond}
                    onClick={() => handleConditionChange(cond)}
                    className={`flex-1 py-2 px-3 rounded-xl text-center text-xs font-bold border transition-all uppercase tracking-wider cursor-pointer outline-none ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/10'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FacetSidebar;
