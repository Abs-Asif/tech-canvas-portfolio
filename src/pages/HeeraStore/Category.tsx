import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { PRODUCTS } from './data';
import ProductCard from './ProductCard';

const Category: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    if (categoryId && categoryId.toLowerCase() !== 'all') {
      result = PRODUCTS.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [categoryId, sortBy]);

  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : '';

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold font-bangla">{categoryName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sorting Chips */}
        <div className="flex items-center gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSortBy('default')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              sortBy === 'default'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
            }`}
          >
            সবগুলো
          </button>
          <button
            onClick={() => setSortBy('price-low')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              sortBy === 'price-low'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            কম মূল্য
          </button>
          <button
            onClick={() => setSortBy('price-high')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              sortBy === 'price-high'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            বেশি মূল্য
          </button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <p className="text-xs text-zinc-500 mb-6 font-bangla">মোট {filteredProducts.length} টি পণ্য পাওয়া গেছে</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 font-bangla">এই ক্যাটাগরিতে কোনো পণ্য নেই।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
