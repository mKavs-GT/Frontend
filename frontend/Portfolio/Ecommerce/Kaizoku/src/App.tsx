import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Preloader } from './components/Preloader';
import { NewsletterModal } from './components/NewsletterModal';

function App() {
  return (
    <Router>
      <main className="w-full bg-[#0C0C0C] text-[#D7E2EA] font-kanit selection:bg-[#7721B1] selection:text-white">
        <Preloader />
        <NewsletterModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
