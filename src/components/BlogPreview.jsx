import React, { useState, useEffect } from 'react';
import { HiArrowRight, HiNewspaper } from 'react-icons/hi';
import { blogApiEndpoints } from '../services/blogApi';

const BlogPreview = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await blogApiEndpoints.getBlogs(0, 3);
                setFeaturedBlogs(response.data.content || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
                setError(err.message);
                setFeaturedBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Don't render the section if there are no blogs or error occurred
    if (loading) {
        return (
            <section className="container mx-auto max-w-7xl px-4 mt-16 mb-20 animate-fade-in">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 dark:border-cyan-400"></div>
                </div>
            </section>
        );
    }

    // Hide section completely if no blogs or error
    if (error || featuredBlogs.length === 0) {
        return null;
    }

    // Helper function to get media URL
    const getMediaUrl = (blog) => {
        if (blog.youtubeLink) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = blog.youtubeLink.match(regExp);
            if (match && match[2].length === 11) {
                return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
            }
        }
        if (blog.imagePath) {
            return blog.imagePath;
        }
        return 'https://placehold.co/400x300/E0F2E9/333333?text=Blog';
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <section className="container mx-auto max-w-7xl px-4 mt-16 mb-20 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <HiNewspaper className="text-cyan-600 dark:text-cyan-400" />
                        Blog & Artikel
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Temukan tips, review, dan panduan seputar hobi Anda
                    </p>
                </div>
                <a
                    href="http://localhost:81"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 group"
                >
                    Lihat Semua Blog
                    <HiArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBlogs.map((blog) => (
                    <a
                        key={blog.id}
                        href={`http://localhost:81/blogs/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 group border border-gray-200 dark:border-gray-700 block"
                    >
                        {/* Blog Image */}
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                            <img
                                src={getMediaUrl(blog)}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {blog.categoryName && (
                                <div className="absolute top-3 left-3 bg-cyan-600 dark:bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {blog.categoryName}
                                </div>
                            )}
                            {blog.youtubeLink && (
                                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white p-1.5 rounded-lg">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Blog Content */}
                        <div className="p-5">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(blog.publishedAt)}</p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                {blog.title}
                            </h3>
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {blog.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700 italic">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-semibold group-hover:gap-2 transition-all">
                                Baca Selengkapnya
                                <HiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default BlogPreview;
