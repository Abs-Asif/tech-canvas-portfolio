import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  const deliveryFee = items.length > 0 ? 60 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold mb-2 font-bangla">আপনার ব্যাগ খালি</h2>
        <p className="text-zinc-500 mb-8 font-bangla">ব্যাগে কোন পণ্য নেই। কেনাকাটা শুরু করতে নিচের বাটনে ক্লিক করুন।</p>
        <Link to="/EC" className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold font-bangla">
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 pb-12">
      <h1 className="text-2xl font-black mb-8 font-bangla">শপিং ব্যাগ</h1>

      <div className="space-y-6 mb-10">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className="w-24 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 font-bangla">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">{item.category}</p>
                <p className="text-base font-black mt-2">৳ {item.price.toLocaleString('bn-BD')}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-600 dark:text-zinc-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{item.quantity.toLocaleString('bn-BD')}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-600 dark:text-zinc-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl shadow-zinc-900/5 border border-zinc-100 dark:border-zinc-800">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-bangla">সাব-টোটাল</span>
            <span className="font-bold">৳ {subtotal.toLocaleString('bn-BD')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-bangla">ডেলিভারি চার্জ</span>
            <span className="font-bold">৳ {deliveryFee.toLocaleString('bn-BD')}</span>
          </div>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
          <div className="flex justify-between text-lg font-black">
            <span className="font-bangla">মোট</span>
            <span>৳ {total.toLocaleString('bn-BD')}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/EC/payment')}
          className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform font-bangla shadow-lg shadow-zinc-900/10"
        >
          চেকআউট করুন
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Cart;
