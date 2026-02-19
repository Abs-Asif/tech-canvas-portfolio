import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from './data';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const newArrivals = PRODUCTS.filter(p => p.isNew);
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-8 py-6">
      {/* Hero Banner */}
      <section className="px-4">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">নতুন কালেকশন <br /> ২০২৫</h1>
            <p className="text-zinc-200 text-sm mb-4">সবচেয়ে সেরা ডিজাইনের পোশাক এখন আপনার হাতের মুঠোয়।</p>
            <Link to="/EC/category/all" className="w-fit px-6 py-2 bg-white text-zinc-900 rounded-full text-sm font-bold">
              এখনই কিনুন
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="px-4 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">ক্যাটাগরি</h2>
          <Link to="/EC/category/all" className="text-sm text-zinc-500 flex items-center gap-1">
            সব দেখুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {CATEGORIES.slice(1).map((cat) => (
            <Link
              key={cat.id}
              to={`/EC/category/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <span className="text-2xl">
                  {cat.id === 'panjabi' && '👕'}
                  {cat.id === 'saree' && '👗'}
                  {cat.id === 'shirt' && '👔'}
                  {cat.id === 'tshirt' && '👕'}
                </span>
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="px-4 mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">নতুন কালেকশন</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {newArrivals.map((product) => (
            <div key={product.id} className="w-40 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">জনপ্রিয় পণ্য</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="px-4">
        <div className="bg-zinc-900 dark:bg-white p-8 rounded-3xl text-center">
          <h3 className="text-white dark:text-zinc-900 text-xl font-bold mb-2">ফ্রি শিপিং!</h3>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-4">৩০০০ টাকার বেশি কেনাকাটা করলে ফ্রি ডেলিভারি।</p>
          <div className="inline-block px-4 py-1 bg-zinc-800 dark:bg-zinc-100 text-zinc-400 dark:text-zinc-500 rounded-full text-[10px] font-mono uppercase tracking-widest">
            CODE: FREE2025
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
