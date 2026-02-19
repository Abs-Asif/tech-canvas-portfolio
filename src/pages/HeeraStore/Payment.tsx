import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, CheckCircle2, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCart } from './CartContext';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    // Simulate payment process
    toast.loading('পেমেন্ট প্রসেসিং হচ্ছে...');
    setTimeout(() => {
      toast.dismiss();
      setIsSuccess(true);
      clearCart();
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">ধন্যবাদ!</h2>
        <p className="text-zinc-500 mb-2">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।</p>
        <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-lg mb-8">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">অর্ডার নম্বর</p>
          <p className="font-mono font-bold text-lg">21221150057</p>
        </div>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => navigate('/EC/tracking')}
            className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold"
          >
            অর্ডার ট্র্যাক করুন
          </button>
          <button
            onClick={() => navigate('/EC')}
            className="w-full h-12 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            হোমে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <h1 className="text-2xl font-bold mb-8">পেমেন্ট পদ্ধতি</h1>

      <div className="space-y-4 mb-10">
        {[
          { id: 'bkash', name: 'বিকাশ (bKash)', icon: Smartphone },
          { id: 'nagad', name: 'নগদ (Nagad)', icon: Smartphone },
          { id: 'card', name: 'ডেবিট/ক্রেডিট কার্ড', icon: CreditCard },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as any)}
              className={cn(
                "w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all",
                method === m.id
                  ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-md"
                  : "border-zinc-100 dark:border-zinc-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  method === m.id ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold">{m.name}</span>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                method === m.id ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-800"
              )}>
                {method === m.id && <div className="w-2.5 h-2.5 bg-zinc-900 dark:bg-white rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-8">
        <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">ডেলিভারি ঠিকানা</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          আব্দুল্লাহ আল আসীফ<br />
          বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি<br />
          ঢাকা, বাংলাদেশ
        </p>
      </div>

      <button
        onClick={handlePayment}
        className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 dark:shadow-white/5 active:scale-95 transition-transform"
      >
        পেমেন্ট নিশ্চিত করুন
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Payment;
