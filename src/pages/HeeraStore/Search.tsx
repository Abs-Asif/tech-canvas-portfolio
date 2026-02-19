import React, { useState } from 'react';
import { PRODUCTS } from './data';
import ProductCard from './ProductCard';
import { Search as SearchIcon, X } from 'lucide-react';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredProducts = query.trim() === ''
    ? []
    : PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="py-6 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="পণ্য খুঁজুন..."
          className="w-full h-14 pl-12 pr-12 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none text-base"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        )}
      </div>

      <div>
        {query.trim() !== '' ? (
          <>
            <h2 className="text-lg font-bold mb-6">ফলাফল ({filteredProducts.length})</h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-zinc-500">দুঃখিত, আপনার খোঁজা পণ্যটি পাওয়া যায়নি।</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-4">জনপ্রিয় সার্চ</h2>
            <div className="flex flex-wrap gap-2">
              {['পাঞ্জাবি', 'শাড়ি', 'সাদা পাঞ্জাবি', 'ফরমাল শার্ট'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
