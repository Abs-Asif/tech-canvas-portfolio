import React from 'react';
import { Link } from 'react-router-dom';
import { Product, CATEGORIES } from './data';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      to={`/EC/product/${product.id}`}
      className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm text-zinc-900 dark:text-white"
          onClick={(e) => {
            e.preventDefault();
            // Toggle favorite
          }}
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 font-bangla">
          {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
        </p>
        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-1 mb-2 font-bangla">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-zinc-900 dark:text-white">
            ৳ {product.price.toLocaleString('bn-BD')}
          </p>
          {product.rating && (
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md">
              <span className="text-[10px] font-bold dark:text-zinc-300">{product.rating}</span>
              <span className="text-yellow-500 text-[10px]">★</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
