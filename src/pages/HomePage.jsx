import React from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import BlogPreview from '../components/BlogPreview';


const HomePage = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <Header />

        <main>

            <HeroBanner />
            <CategoryList />
            <ProductList />
            <BlogPreview />
        </main>
        
        </div>
    );
};

export default HomePage;