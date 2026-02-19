import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from './data';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const activeCategoryId = id || 'all';

  const filteredProducts = activeCategoryId === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategoryId);

  return (
    <div className="py-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 mb-8 pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/EC/category/${cat.id}`}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategoryId === cat.id
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">
            {CATEGORIES.find(c => c.id === activeCategoryId)?.name} কালেকশন
          </h1>
          <span className="text-xs text-zinc-500">{filteredProducts.length} টি পণ্য</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-zinc-500">এই ক্যাটাগরিতে কোন পণ্য পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
