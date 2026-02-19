import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Tracking: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const FIXED_ORDER = '21221150057';

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim() === FIXED_ORDER) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
      // Optional: show error toast
    }
  };

  const steps = [
    { label: 'অর্ডার গ্রহণ করা হয়েছে', time: '১০ জানুয়ারি, ২০২৫ - ১০:৩০ AM', status: 'completed', icon: Clock },
    { label: 'প্রসেসিং হচ্ছে', time: '১০ জানুয়ারি, ২০২৫ - ০২:৪৫ PM', status: 'completed', icon: Package },
    { label: 'শিপিং করা হয়েছে', time: '১১ জানুয়ারি, ২০২৫ - ০৯:১৫ AM', status: 'current', icon: Truck },
    { label: 'ডেলিভারি সম্পন্ন', time: 'অপেক্ষিত: ১২ জানুয়ারি', status: 'upcoming', icon: CheckCircle2 },
  ];

  return (
    <div className="py-6 px-4">
      <h1 className="text-2xl font-bold mb-8">অর্ডার ট্র্যাকিং</h1>

      <form onSubmit={handleTrack} className="mb-10">
        <div className="relative">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="অর্ডার নম্বর দিন (যেমন: 21221150057)"
            className="w-full h-14 pl-6 pr-16 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 w-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showStatus ? (
        <div className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-900/5 dark:shadow-none">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">অর্ডার নম্বর</p>
              <p className="font-bold text-lg">#{FIXED_ORDER}</p>
            </div>
            <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-[10px] font-bold uppercase tracking-wider">
              শিপিং এ আছে
            </div>
          </div>

          <div className="space-y-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-900" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-6 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-sm",
                    step.status === 'completed' ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" :
                    step.status === 'current' ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-900 dark:border-white" :
                    "bg-zinc-100 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-sm font-bold mb-1",
                      step.status === 'upcoming' ? "text-zinc-400" : "text-zinc-900 dark:text-white"
                    )}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-zinc-500">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : orderNumber.trim() !== '' && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-zinc-200" />
          </div>
          <p className="text-zinc-500 font-medium">অর্ডারটি খুঁজে পাওয়া যায়নি।<br />সঠিক নম্বর দিয়ে পুনরায় চেষ্টা করুন।</p>
        </div>
      )}
    </div>
  );
};

export default Tracking;
