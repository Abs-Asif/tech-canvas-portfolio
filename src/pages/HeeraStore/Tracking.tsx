import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Package, Truck, CheckCircle2, MapPin } from 'lucide-react';

const TRACKING_NUMBER = "21221150057";

const Tracking: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId === TRACKING_NUMBER) {
      setShowResult(true);
    } else {
      alert('দুঃখিত, এই অর্ডার নাম্বারটি সঠিক নয়। (পরীক্ষার জন্য ব্যবহার করুন: 21221150057)');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-4 h-16 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold font-bangla">অর্ডার ট্র্যাকিং</h1>
      </div>

      <div className="p-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-8">
          <h2 className="text-xl font-bold mb-2 font-bangla text-zinc-900 dark:text-white">আপনার অর্ডার ট্রাক করুন</h2>
          <p className="text-sm text-zinc-500 mb-6 font-bangla leading-relaxed">অর্ডার করার সময় প্রাপ্ত ১১ ডিজিটের অর্ডার নাম্বারটি এখানে প্রদান করুন।</p>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="অর্ডার নাম্বার (উদা: 21221150057)"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-mono"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all font-bangla shadow-lg shadow-zinc-900/10"
            >
              <Search size={20} />
              ট্রাক করুন
            </button>
          </form>
        </div>

        {showResult && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bangla">অর্ডার আইডি</p>
                  <p className="text-sm font-bold font-mono">#{TRACKING_NUMBER}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-bangla">
                  ডেলিভারির পথে
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-bangla">অর্ডার গ্রহণ করা হয়েছে</p>
                    <p className="text-xs text-zinc-500 font-mono">12 Oct, 2023 - 10:30 AM</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-bangla">প্যাকিং সম্পন্ন হয়েছে</p>
                    <p className="text-xs text-zinc-500 font-mono">12 Oct, 2023 - 04:45 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center z-10 animate-pulse">
                    <Truck size={12} className="text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-bangla">ডেলিভারির জন্য পাঠানো হয়েছে</p>
                    <p className="text-xs text-zinc-500 font-mono">13 Oct, 2023 - 09:15 AM</p>
                  </div>
                </div>

                <div className="flex gap-4 relative opacity-40">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center z-10">
                    <MapPin size={12} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold font-bangla">ডেলিভারি সম্পন্ন</p>
                    <p className="text-xs text-zinc-500">অপেক্ষমান</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 dark:bg-white p-6 rounded-3xl text-white dark:text-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bangla">সম্ভাব্য ডেলিভারি</p>
                  <p className="text-sm font-bold font-bangla">১৫ অক্টোবর, ২০২৩</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
