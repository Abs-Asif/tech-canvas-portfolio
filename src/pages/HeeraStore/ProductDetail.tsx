import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from './data';
import { ShoppingBag, Heart, Share2, Star, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from './CartContext';
import ProductCard from './ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return <div className="p-10 text-center font-bangla">পণ্যটি খুঁজে পাওয়া যায়নি।</div>;
  }

  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize && product.sizes[0] !== 'Free Size') {
      toast.error('অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন');
      return;
    }
    addToCart(product);
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-full max-w-sm animate-in slide-in-from-bottom-5">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-zinc-900 dark:text-white">{product.name}</p>
          <p className="text-xs text-zinc-500">ব্যাগে যোগ করা হয়েছে</p>
        </div>
        <button
          onClick={() => {
            navigate('/EC/cart');
            toast.dismiss(t);
          }}
          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold"
        >
          ব্যাগ দেখুন
        </button>
      </div>
    ), { duration: 3000 });
  };

  return (
    <div className="pb-24">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 mt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block font-bangla">
              {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
            </span>
            <h1 className="text-2xl font-bold font-bangla">{product.name}</h1>
          </div>
          <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-full">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <p className="text-2xl font-black">৳ {product.price.toLocaleString('bn-BD')}</p>
          <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-md">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">4.8</span>
          </div>
        </div>

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider font-bangla">সাইজ সিলেক্ট করুন</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all",
                    selectedSize === size
                      ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg"
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-500"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-bold mb-3 uppercase tracking-wider font-bangla">বিস্তারিত</h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-bangla">
            {product.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 dark:shadow-white/5 active:scale-95 transition-transform font-bangla"
          >
            <ShoppingBag className="w-5 h-5" />
            কার্টে যোগ করুন
          </button>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8 pb-10">
            <h3 className="text-lg font-bold mb-6 font-bangla">অনুরূপ আরও পণ্য</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
