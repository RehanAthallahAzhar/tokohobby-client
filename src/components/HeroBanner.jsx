import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import DiscountCart from '../assets/discount-cart.png';

const slideData = [
    {
        id: 1,
        title: 'Yuk, belanja di Tokohobby',
        subtitle: 'Cek barang dari beragam kategori hobi.',
        buttonText: 'Cek Sekarang',
        bgGradient: 'from-emerald-500 via-green-500 to-teal-600',
        btnColor: 'hover:from-emerald-600 hover:to-teal-700',
        img: DiscountCart 
    },
    {
        id: 2,
        title: 'Promo Kilat Special',
        subtitle: 'Diskon besar-besaran untuk action figure langka  & model kits premium.',
        buttonText: 'Lihat Promo',
        bgGradient: 'from-blue-600 via-cyan-500 to-blue-700',
        btnColor: 'hover:from-blue-700 hover:to-cyan-700',
        img: DiscountCart
    },
    {
        id: 3,
        title: 'Hobi Baru, Semangat Baru',
        subtitle: 'Temukan perlengkapan olahraga & outdoor favoritmu.',
        buttonText: 'Mulai Berpetualang',
        bgGradient: 'from-orange-500 via-amber-500 to-yellow-600',
        btnColor: 'hover:from-orange-600 hover:to-yellow-700',
        img: DiscountCart
    },
];


const HeroBanner = () => {
    return (
        <section className="container mx-auto max-w-7xl px-4 mt-8 animate-fade-in relative">

        <Swiper
                modules={[Pagination, Navigation, Autoplay, EffectFade]}
                loop={true}
                autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                pagination={{ 
                    clickable: true,
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !opacity-100',
                }}
                navigation={true}
                className="rounded-3xl hero-slider shadow-2xl overflow-hidden"
        >

                {slideData.map((slide, index) => (
                <SwiperSlide 
                    key={slide.id} 
                    className="relative !flex items-center justify-between"
                >
                    {/* Background with gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}>
                        {/* Animated pattern overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl top-0 -left-48 animate-pulse" style={{ animationDuration: '4s', animationDelay: `${index * 0.5}s` }} />
                            <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 -right-48 animate-pulse" style={{ animationDuration: '5s', animationDelay: `${index * 0.7}s` }} />
                        </div>
                        
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 w-full p-8 md:p-12 z-10">

                    {/* left: Teks and button */}
                    <div className="w-full md:w-1/2 text-center md:text-left text-white">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <HiSparkles className="text-yellow-300 animate-pulse" size={28} />
                            <span className="text-yellow-200 font-bold text-sm uppercase tracking-wider">Special Offer</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 animate-fade-in drop-shadow-2xl">
                            {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md mx-auto md:mx-0 drop-shadow-lg">
                            {slide.subtitle}
                        </p>
                        <button
                            className={`group relative inline-flex items-center gap-2 py-4 px-8 rounded-xl font-black text-lg border-3 border-white bg-white/10 backdrop-blur-sm text-white transition-all duration-500 hover:bg-white hover:text-gray-900 hover:scale-105 hover:shadow-2xl overflow-hidden`}
                            >
                            {/* Button glow effect */}
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            
                            <span className="relative z-10">{slide.buttonText}</span>
                            <HiArrowRight className="relative z-10 transition-transform group-hover:translate-x-2" size={24} />
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 max-w-md hidden md:flex justify-center items-center">
                                {/* Ganti ini dengan gambar/ilustrasi Anda */}
                    <div className="relative animate-float">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                        <img 
                            src={slide.img} 
                            alt={slide.title} 
                            className="relative w-full h-auto object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    </div>
                    </div> 
                </SwiperSlide>
                ))}
        </Swiper>
        </section>
    );
};

export default HeroBanner;
