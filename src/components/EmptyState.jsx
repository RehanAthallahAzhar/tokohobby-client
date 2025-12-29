import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

/*
 * Reusable Component for Empty Display
 * Accepts props:
 * - icon: Icon component from react-icons (e.g., HiOutlineShoppingCart)
 * - title: Large title (e.g., "Empty Cart")
 * - message: Description message
 * - linkTo: URL for the button (e.g., "/")
 * - linkText: Text for the button (e.g., "Start Shopping")
 */
const EmptyState = ({ icon, title, message, linkTo, linkText }) => {
    const IconComponent = icon;

    return (
        <div className="flex justify-center items-center py-20 animate-fade-in">
            <div className="text-center bg-white dark:bg-gray-900 p-12 md:p-16 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-lg w-full">
                {/* Ikon Dinamis */}
                {IconComponent && (
                    <IconComponent size={80} className="mx-auto text-gray-300 dark:text-gray-600" />
                )}

                {/* Judul Dinamis */}
                <h2 className="mt-6 text-2xl font-extrabold text-blue-900 dark:text-white">{title}</h2>

                {/* Pesan Dinamis */}
                <p className="mt-3 max-w-md text-base text-gray-600 dark:text-gray-400">{message}</p>

                {/* Tombol Aksi Dinamis */}
                <Link
                    to={linkTo}
                    className="mt-10 inline-flex items-center gap-2 bg-cyan-600 dark:bg-cyan-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-colors duration-200"
                >
                    <HiOutlineArrowLeft size={20} />
                    {linkText}
                </Link>
            </div>
        </div>
    );
};

export default EmptyState;
