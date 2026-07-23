import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';


import RootLayout from './components/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/contacts" element={<ComingSoonPage />} />
        <Route path="/help" element={<ComingSoonPage />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/shipping" element={<ComingSoonPage />} />

            <Route path="/orders" element={<OrderHistoryPage />} />
            {/* <Route path="/orders/:id" element={<OrderDetailPage />} /> */}

            {/* --- seller & admin only --- */}
            <Route element={<RoleBasedRoute allowedRoles={['admin', 'seller']} />}>
              <Route path="/dashboard/seller" element={<ProductListPage />} /> 
            </Route>
            
            {/* --- admin only --- */}
            <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard/products" element={<DashboardPage />} />
            </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;