import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { cartApi, productApi } from '../services/api';
import Header from '../components/Header';
import QuantitySpinner from '../components/QuantitySpinner';
import { HiOutlineChevronLeft, HiChevronDown, HiChevronUp, HiOutlineMapPin, HiOutlineTruck } from 'react-icons/hi2';
import { HiOutlineShoppingCart, HiOutlineHeart, HiHeart, HiStar } from 'react-icons/hi';
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
    return [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=600'
    ];
  }
  if (name.includes('figure') || name.includes('action figure') || name.includes('nendoroid') || name.includes('koleksi') || name.includes('scale')) {
    return [
      'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1559893088-c0787ebfc084?auto=format&fit=crop&q=80&w=600'
    ];
  }
  if (name.includes('game') || name.includes('puzzle') || name.includes('boardgame') || name.includes('kartu')) {
    return [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606500465376-138a291393a4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=600'
    ];
  }
  return [
    `https://picsum.photos/id/${(hash % 800) + 100}/600/600`,
    `https://picsum.photos/id/${((hash + 1) % 800) + 100}/600/600`,
    `https://picsum.photos/id/${((hash + 2) % 800) + 100}/600/600`
  ];
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
  
  // Purchase State
  const [quantity, setQuantity] = useState(1);
  const [cartNote, setCartNote] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null); 

  // UI Interactive States (Gambar 4 Look)
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [deliveryOption, setDeliveryOption] = useState('ship'); // 'ship' or 'pickup'
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Accordion Sections State
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    specification: false,
    shipping: false
  });

  const colors = [
    { name: 'Cyan Spark', class: 'bg-cyan-500' },
    { name: 'Cherry Ember', class: 'bg-red-500' },
    { name: 'Midnight Blue', class: 'bg-indigo-900' },
    { name: 'Slate Gray', class: 'bg-slate-500' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

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
      // Append selected details in description
      const fullNote = `Warna: ${colors[selectedColor].name}, Ukuran: ${selectedSize}, Opsi: ${deliveryOption === 'ship' ? 'Kirim' : 'Ambil di Toko'}. ${cartNote}`;
      await cartApi.post(`/${id}`, {
        quantity: quantity,
        description: fullNote,
      });
      setCartMessage({ type: 'success', text: 'Produk berhasil ditambahkan ke keranjang belanja!' });
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

  const toggleAccordion = (section) => {
    setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-3xl font-black text-red-600 mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'Produk tidak ditemukan.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-full transition-all">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const finalPrice = calculateDiscountedPrice(product.price, product.discount);
  
  // Galleries representation
  const images = getProductImage(product);

  const handleNextImage = () => {
    setActiveImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setActiveImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-gray-950 transition-colors duration-300">
      <Header />
      
      {/* Breadcrumb Area */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-750 dark:text-cyan-400 hover:underline transition-all"
        >
          <HiOutlineChevronLeft size={16} />
          Kembali ke Katalog
        </button>
      </div>

      <main className="container mx-auto max-w-7xl px-4 pb-16">
        
        {/* Product Grid Area - Split screen layout matching Gambar 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Galeri Foto E-commerce */}
          <div className="lg:col-span-7 space-y-6 animate-slide-in-left">
            
            {/* Main Picture Frame */}
            <div className="relative aspect-square bg-white dark:bg-gray-900 border-2 border-cyan-100/50 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl group">
              <img
                src={images[activeImgIndex]}
                alt={`${product.name} - Tampilan ${activeImgIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Prev / Next Navigation Arrows - Inspired by Gambar 4 */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-850 p-3 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer z-10"
                aria-label="Foto Sebelumnya"
              >
                <HiOutlineChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-850 p-3 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer z-10"
                aria-label="Foto Selanjutnya"
              >
                {/* We use chevron left rotated/next chevron */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Zoom pill/hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-950/60 backdrop-blur-xs px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-md">
                Tampilan {activeImgIndex + 1} dari {images.length}
              </div>

              {/* Stock Warning Badge */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse shadow-md">
                  Sisa {product.stock} pcs!
                </div>
              )}
            </div>

            {/* Thumbnail Image List - Inspired by Gambar 4 */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImgIndex === idx 
                      ? 'border-cyan-500 shadow-md scale-105' 
                      : 'border-cyan-100/50 dark:border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Gallery Info Details Caption - Inspired by Gambar 4 */}
            <div className="text-center bg-cyan-50/30 dark:bg-gray-900/40 p-4 rounded-3xl border border-cyan-100/30 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                *Spesifikasi Model: Skala Figure 1:7 | Tinggi 21.5cm | Berbahan Premium PVC & ABS
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Info Detail & Opsi Pembelian */}
          <div className="lg:col-span-5 space-y-6 animate-slide-in-right [animation-delay:150ms]">
            
            {/* Kategori Badge & Wishlist Action */}
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-4 py-2 rounded-full border border-cyan-150">
                KATEGORI: {product.type.toUpperCase()}
              </span>
              
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center gap-2 font-bold text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 transition-colors p-1 cursor-pointer"
              >
                {isWishlisted ? (
                  <>
                    <HiHeart className="text-red-500 animate-scale-in" size={20} />
                    <span>Tersimpan di Wishlist</span>
                  </>
                ) : (
                  <>
                    <HiOutlineHeart size={20} />
                    <span>Simpan ke Wishlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Product Title & Review */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center text-amber-500">
                  <HiStar size={16} />
                  <HiStar size={16} />
                  <HiStar size={16} />
                  <HiStar size={16} />
                  <HiStar size={16} />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">(5.0)</span>
                <span className="text-gray-300">|</span>
                <span className="underline hover:text-cyan-600 transition-colors cursor-pointer font-medium">1 Ulasan Pembeli</span>
              </div>
            </div>

            {/* Price Frame */}
            <div className="bg-gradient-to-r from-cyan-500/5 to-cyan-500/10 dark:from-gray-900/60 dark:to-gray-900/40 p-6 rounded-3xl border border-cyan-100 dark:border-gray-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400">
                  {formatCurrency(finalPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <div className="mt-2 text-xs text-red-600 font-bold bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-lg inline-block">
                  Hemat {formatCurrency(product.price - finalPrice)} ({product.discount}% OFF)
                </div>
              )}
            </div>

            {/* Color Selector - Inspired by Gambar 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <span>Pilih Varian Warna</span>
                <span className="text-cyan-600 font-black">{colors[selectedColor].name}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-9 h-9 rounded-full ${color.class} border-3 relative transition-all duration-200 cursor-pointer ${
                      selectedColor === idx 
                        ? 'border-cyan-600 dark:border-white scale-110 shadow-lg' 
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Pilih warna ${color.name}`}
                  >
                    {selectedColor === idx && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector - Inspired by Gambar 4 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <span>Pilih Ukuran</span>
                <button className="text-cyan-650 hover:underline font-black cursor-pointer">Panduan Ukuran</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-3 rounded-xl text-center text-sm font-bold border-2 transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-105'
                        : 'bg-white dark:bg-gray-900 border-cyan-100/50 dark:border-gray-800 text-gray-750 dark:text-gray-300 hover:bg-cyan-50/50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery / Pickup Options Card - Inspired by Gambar 4 */}
            <div className="border-2 border-cyan-100/70 dark:border-gray-800 rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900">
              
              {/* Option 1: Ship */}
              <label className={`flex items-start gap-4 p-5 border-b border-cyan-100/50 dark:border-gray-800 cursor-pointer transition-colors ${
                deliveryOption === 'ship' ? 'bg-cyan-50/30 dark:bg-cyan-950/20' : 'hover:bg-gray-50/50'
              }`}>
                <input 
                  type="radio" 
                  name="delivery_method" 
                  checked={deliveryOption === 'ship'}
                  onChange={() => setDeliveryOption('ship')}
                  className="mt-1 border-gray-300 text-cyan-600 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-black text-sm text-gray-900 dark:text-white">
                    <HiOutlineTruck size={18} className="text-cyan-600" />
                    <span>Kirim ke Alamat Saya</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Gratis ongkir untuk seluruh pulau Jawa dengan minimum transaksi Rp 200rb.
                  </p>
                </div>
              </label>

              {/* Option 2: Pickup */}
              <label className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                deliveryOption === 'pickup' ? 'bg-cyan-50/30 dark:bg-cyan-950/20' : 'hover:bg-gray-50/50'
              }`}>
                <input 
                  type="radio" 
                  name="delivery_method" 
                  checked={deliveryOption === 'pickup'}
                  onChange={() => setDeliveryOption('pickup')}
                  className="mt-1 border-gray-300 text-cyan-600 focus:ring-cyan-500/30 w-4 h-4 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-black text-sm text-gray-900 dark:text-white">
                    <HiOutlineMapPin size={18} className="text-cyan-600" />
                    <span>Ambil Langsung di Toko</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Siap diambil dalam 2 jam di Tokohobby Bandung, Jl. Kembang Raya No. 45.
                  </p>
                </div>
              </label>

            </div>

            {/* Purchase Note & Add to Cart Frame */}
            <div className="space-y-4 pt-2">
              {cartMessage && (
                <div className={`p-4 rounded-2xl text-xs font-bold animate-scale-in border ${
                  cartMessage.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {cartMessage.text}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-gray-700 dark:text-gray-300">Atur Kuantitas:</span>
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
                placeholder="Catatan pembelian (opsional)"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300/80 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 text-sm placeholder-gray-400"
              />

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="group relative w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-base text-white bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
              >
                {/* Glow shining hover animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                {isAddingToCart ? (
                  <>
                    <LoadingSpinner />
                    <span>Menambahkan...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingCart size={20} />
                    <span>Tambahkan ke Keranjang</span>
                  </>
                )}
              </button>
            </div>

            {/* Accordion Lipat Detail - Inspired by Gambar 4 */}
            <div className="space-y-2 pt-4 border-t border-gray-150 dark:border-gray-800">
              
              {/* Accordion Item 1 */}
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <button 
                  onClick={() => toggleAccordion('details')}
                  className="flex items-center justify-between w-full text-left font-black text-gray-900 dark:text-white text-sm hover:text-cyan-600 transition-colors py-2 cursor-pointer"
                >
                  <span>📝 Deskripsi Produk</span>
                  {openAccordions.details ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                </button>
                {openAccordions.details && (
                  <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed pt-1.5 animate-scale-in">
                    {product.description || 'Tidak ada deskripsi tambahan.'}
                  </p>
                )}
              </div>

              {/* Accordion Item 2 */}
              <div className="border-b border-gray-150 dark:border-gray-800 pb-3">
                <button 
                  onClick={() => toggleAccordion('specification')}
                  className="flex items-center justify-between w-full text-left font-black text-gray-900 dark:text-white text-sm hover:text-cyan-600 transition-colors py-2 cursor-pointer"
                >
                  <span>⚙️ Spesifikasi & Kelayakan</span>
                  {openAccordions.specification ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                </button>
                {openAccordions.specification && (
                  <ul className="text-xs text-gray-650 dark:text-gray-400 list-disc pl-5 space-y-1 pt-1.5 animate-scale-in">
                    <li>100% Produk Original Berlisensi Resmi</li>
                    <li>Sertifikasi SNI untuk keamanan kualitas</li>
                    <li>Detail pahatan presisi tinggi tinggi</li>
                    <li>Cocok untuk kolektor berusia 15 tahun ke atas</li>
                  </ul>
                )}
              </div>

              {/* Accordion Item 3 */}
              <div className="pb-2">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="flex items-center justify-between w-full text-left font-black text-gray-900 dark:text-white text-sm hover:text-cyan-600 transition-colors py-2 cursor-pointer"
                >
                  <span>📦 Kebijakan Pengiriman & Retur</span>
                  {openAccordions.shipping ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                </button>
                {openAccordions.shipping && (
                  <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed pt-1.5 animate-scale-in">
                    Barang dikemas menggunakan bubble wrap ekstra tebal dan kardus pelindung khusus secara gratis. Pengembalian barang hanya diterima dengan menyertakan bukti video unboxing lengkap tanpa jeda.
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ProductDetailPage;
