import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import Boutique from './pages/Boutique';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import OrderDetails from './pages/OrderDetails';

// Simple wrapper to handle legacy Laravel category routes
function CategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/shop?category=${slug}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/order/:orderNumber" element={<OrderDetails />} />
        <Route path="/category/:slug" element={<CategoryRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
