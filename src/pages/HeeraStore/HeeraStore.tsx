import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeeraLayout from './HeeraLayout';
import Home from './Home';
import Category from './Category';
import ProductDetail from './ProductDetail';
import Search from './Search';
import Cart from './Cart';
import Payment from './Payment';
import Tracking from './Tracking';
import { CartProvider } from './CartContext';

const HeeraStore: React.FC = () => {
  return (
    <CartProvider>
      <HeeraLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/tracking" element={<Tracking />} />
        </Routes>
      </HeeraLayout>
    </CartProvider>
  );
};

export default HeeraStore;
