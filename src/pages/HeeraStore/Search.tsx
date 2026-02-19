import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, ChevronLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './data';
import ProductCard from './ProductCard';

const POPULAR_SEARCHES = ['শাড়ি', 'পাঞ্জাবি', 'বোরকা', 'হিজাব', 'সেলোয়ার কামিজ'];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-black">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              autoFocus
              type="text"
              placeholder="পছন্দের পোশাক খুঁজুন..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-bangla"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-zinc-200 dark:bg-zinc-800 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        {!query && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-bold font-bangla">জনপ্রিয় সার্চসমূহ</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map(item => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full text-xs font-medium font-bangla hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div>
            <p className="text-xs text-zinc-500 mb-6 font-bangla">
              "{query}" এর জন্য {results.length} টি ফলাফল পাওয়া গেছে
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {results.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="text-zinc-500 font-bangla">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
