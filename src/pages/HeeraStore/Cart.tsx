import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  const deliveryFee = items.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">আপনার ব্যাগ খালি</h2>
        <p className="text-zinc-500 mb-8">ব্যাগে কোন পণ্য নেই। কেনাকাটা শুরু করতে নিচের বাটনে ক্লিক করুন।</p>
        <Link to="/EC" className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <h1 className="text-2xl font-bold mb-8">শপিং ব্যাগ</h1>

      <div className="space-y-6 mb-10">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-24 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-zinc-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{item.category}</p>
                <p className="text-sm font-black mt-2">৳ {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">সাব-টোটাল</span>
            <span className="font-bold">৳ {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">ডেলিভারি চার্জ</span>
            <span className="font-bold">৳ {deliveryFee.toLocaleString()}</span>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex justify-between text-lg font-black">
            <span>মোট</span>
            <span>৳ {total.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/EC/payment')}
          className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 dark:shadow-white/5 active:scale-95 transition-transform"
        >
          চেকআউট করুন
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Cart;
