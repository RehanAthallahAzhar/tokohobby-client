import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

import ActionFigureImage from '../assets/action-figure.png';
import RunImage from '../assets/logo-run.png'
import GameImage from '../assets/logo-game.png' 
import FashionImage from '../assets/logo-fashion.png'

import { categories } from '../data/categories';
import { HiOutlineShoppingBag, HiSparkles } from 'react-icons/hi2';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import Modal from './Modal';

const CategoryCard = ({ category }) => {
    let iconElement;
    if (category.type === 'image') {
        iconElement = <img 
                        src={category.value} 
                        alt={category.name} 
                        className="w-10 h-10 object-contain mb-3 mx-auto transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" 
                        />;
    } else if (category.type === 'icon') {
        const IconComponent = category.value;
        iconElement = <IconComponent 
                        size={40} 
                        className="text-cyan-600 dark:text-cyan-400 mb-3 mx-auto transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" 
                        />;
    }

    return (
        <Link
        to={`/category/${category.slug}`}
        className="group relative flex w-full h-full flex-col items-center justify-center text-center p-5 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent blur-xl animate-pulse" />
        </div>
        
        <div className="relative z-10">
            {iconElement} 
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">{category.name}</span>
            
            {/* Description on hover */}
            {category.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2 max-w-[120px]">
                    {category.description}
                </p>
            )}
        </div>
        
        {/* Corner sparkle effect */}
        <HiSparkles className="absolute top-2 right-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" size={16} />
        </Link>
    );
};

const CategoryList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="container relative z-10 mx-auto max-w-7xl px-4 mt-12 animate-fade-in [animation-delay:200ms]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Kategori Pilihan
                        <HiSparkles className="text-cyan-500 dark:text-cyan-400 animate-pulse" size={24} />
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Temukan hobi favoritmu</p>
                </div>
                <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-white dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-cyan-600 dark:hover:bg-cyan-500 border-2 border-cyan-600 dark:border-cyan-400 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                >
                    Show All
                </button>
            </div>
            
            <Swiper
                modules={[Navigation]}
                navigation={true}
                spaceBetween={16}
                breakpoints={{
                    320: { slidesPerView: 2.5, spaceBetween: 10 },
                    640: { slidesPerView: 4, spaceBetween: 16 },
                    1024: { slidesPerView: 6, spaceBetween: 18 },
                }}
                className="category-slider pb-2"
                >
                {categories.map((category) => (
                <SwiperSlide key={category.slug}>
                        <CategoryCard category={category} />
                </SwiperSlide>
                ))}
            </Swiper>

            <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            title="Semua Kategori"
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                    <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </Modal>

        </section>
    );
};

export default CategoryList;
