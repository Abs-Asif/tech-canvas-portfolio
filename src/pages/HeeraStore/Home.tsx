import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './data';
import ProductCard from './ProductCard';
import { useCart } from './CartContext';

const Home: React.FC = () => {
  const { itemCount } = useCart();
  const featuredProducts = PRODUCTS.slice(0, 4);
  const newArrivals = PRODUCTS.slice(4, 8);

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white dark:text-black font-black text-xs">H</span>
            </div>
            <h1 className="text-lg font-black tracking-tighter dark:text-white font-bangla">হীরা স্টোর</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/EC/search" className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Search size={22} />
            </Link>
            <Link to="/EC/cart" className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="px-4 py-6">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-900 group">
          <img
            src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=1000"
            alt="Hero"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-bangla">বিশেষ সংগ্রহ</span>
            <h2 className="text-2xl font-black text-white mb-4 font-bangla leading-tight">নতুন সংগ্রহের সমারোহে নিজেকে সাজান</h2>
            <Link to="/EC/category/saree" className="w-fit bg-white text-zinc-900 px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-zinc-100 transition-all">
              এখনই দেখুন
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Scroll */}
      <section className="py-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest font-bangla">ক্যাটাগরি</h3>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto px-4 no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/EC/category/${cat.id}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 font-bangla uppercase">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest font-bangla">জনপ্রিয় পণ্য</h3>
          <Link to="/EC/category/saree" className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-1 font-bangla">
            সব দেখুন <ArrowRight size={10} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Seasonal Banner */}
      <div className="px-4 py-8">
        <div className="bg-zinc-900 dark:bg-zinc-100 rounded-3xl p-8 flex flex-col items-center text-center">
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 font-bangla">সীমিত সময়ের অফার</span>
          <h2 className="text-white dark:text-zinc-900 text-2xl font-black mb-6 font-bangla">উৎসবের বিশেষ ছাড়! ৩০% পর্যন্ত সাশ্রয়</h2>
          <button className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
            অফার নিন
          </button>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="py-6 px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest font-bangla">নতুন এসেছে</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
