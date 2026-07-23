import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slideData = [
  {
    id: 1,
    tag: 'Koleksi Terbaru',
    title: 'Action Figures Terlengkap',
    subtitle: 'Temukan berbagai macam action figure dari anime, film, dan game terpopuler dengan harga terbaik.',
    buttonText: 'Belanja Sekarang',
    secondButtonText: 'Lihat Koleksi',
    img: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    tag: 'Diskon Spesial',
    title: 'Model Kits Premium',
    subtitle: 'Rakit impianmu dengan koleksi Gunpla, model mobil, dan tank militer berkualitas tinggi. Diskon hingga 30%!',
    buttonText: 'Lihat Promo',
    secondButtonText: 'Panduan Merakit',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    tag: 'Hobi & Game',
    title: 'Board Games Terpopuler',
    subtitle: 'Kumpul bersama keluarga dan teman jadi lebih seru dengan ribuan pilihan board game interaktif.',
    buttonText: 'Mulai Cari',
    secondButtonText: 'Rekomendasi Game',
    img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800'
  },
];

const HeroBanner = () => {
  return (
    <section className="container mx-auto max-w-7xl px-4 mt-8 animate-fade-in relative">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-cyan-500 !opacity-30 mx-1 transition-all duration-300',
          bulletActiveClass: '!w-8 !rounded-full !opacity-100 !bg-cyan-600',
        }}
        className="overflow-visible"
      >
        {slideData.map((slide) => (
          <SwiperSlide key={slide.id} className="pb-12 bg-transparent">
            {/* Split Screen Layout - Styled like Selfridges but Fun and Non-Boxy */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
              
              {/* Left Column: Playful Text Card */}
              <div className="w-full md:w-1/2 bg-cyan-50/70 dark:bg-gray-900/60 backdrop-blur-md border-2 border-cyan-100/50 dark:border-gray-800/80 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 flex flex-col justify-center min-h-[260px] md:min-h-[380px] shadow-lg shadow-cyan-500/5 relative overflow-hidden group">
                {/* Decorative bubbles */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-200/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-200/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
                
                <div className="relative z-10 flex items-center gap-2 mb-2.5 sm:mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-cyan-500 text-white uppercase tracking-wider shadow-sm shadow-cyan-500/25">
                    <HiSparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {slide.tag}
                  </span>
                </div>
                
                <h1 className="relative z-10 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2.5 sm:mb-4">
                  {slide.title}
                </h1>
                
                <p className="relative z-10 text-xs sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-5 sm:mb-8 max-w-md">
                  {slide.subtitle}
                </p>
                
                <div className="relative z-10 flex flex-wrap gap-2.5 sm:gap-4 items-center">
                  <button className="inline-flex items-center gap-1.5 py-2 px-4 sm:py-3.5 sm:px-7 rounded-full font-black text-xs sm:text-sm text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-600/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                    {slide.buttonText}
                    <HiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button className="inline-flex items-center gap-1.5 py-2 px-4 sm:py-3.5 sm:px-7 rounded-full font-bold text-xs sm:text-sm text-cyan-700 dark:text-cyan-400 bg-white dark:bg-gray-800 border-2 border-cyan-200 dark:border-gray-700 hover:bg-cyan-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer">
                    {slide.secondButtonText}
                  </button>
                </div>
              </div>

              {/* Right Column: Premium Image Card */}
              <div className="w-full md:w-1/2 min-h-[220px] md:min-h-[380px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-transparent hover:border-cyan-200/50 transition-all duration-500 relative group">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Soft gradient mask overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent group-hover:from-gray-900/40 transition-all duration-500"></div>
                
                {/* Floating caption pill */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/30 backdrop-blur-md border border-white/20 px-4 py-2 sm:px-5 sm:py-3 rounded-2xl text-white text-[10px] sm:text-xs font-bold shadow-md flex items-center justify-between">
                  <span>Hobbypedia Official Collection</span>
                  <span className="bg-cyan-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">Verified</span>
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
