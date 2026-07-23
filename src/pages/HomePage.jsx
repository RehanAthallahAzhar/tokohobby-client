import React, { useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import BlogPreview from '../components/BlogPreview';
import FacetSidebar from '../components/FacetSidebar';

const HomePage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        priceMin: '',
        priceMax: '',
        rating: 0,
        condition: '',
        sort: ''
    });

    return (
        <div className="bg-[#FBFBFB] dark:bg-gray-950 min-h-screen transition-colors duration-300">
        <Header />

        <main>
            <HeroBanner />
            <CategoryList />
            
            {/* Split Layout: Filter Facet Sidebar + Product Listing Grid */}
            <div className="container mx-auto max-w-7xl px-4 mt-6 sm:mt-12 mb-12 sm:mb-24">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Column: Sidebar filter (Hidden on mobile/tablet) */}
                    <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 z-20">
                        <FacetSidebar 
                            filters={filters} 
                            setFilters={setFilters} 
                            products={allProducts} 
                        />
                    </div>
                    
                    {/* Right Column: Products grid */}
                    <div className="w-full lg:w-3/4">
                        <ProductList 
                            filters={filters} 
                            onLoaded={setAllProducts} 
                        />
                    </div>
                </div>
            </div>

            <BlogPreview />
        </main>
        
        </div>
    );
};

export default HomePage;