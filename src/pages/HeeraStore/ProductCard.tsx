import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from './data';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/EC/product/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-zinc-900/90 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm">
            নতুন
          </span>
        )}
        <button className="absolute bottom-3 right-3 w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div>
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{product.name}</h3>
        <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">৳ {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
