import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, CreditCard, Landmark, Wallet, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from './CartContext';
import { toast } from 'sonner';

const DISTRICTS = [
  "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    district: 'ঢাকা',
    address: ''
  });

  const deliveryFee = 60;
  const total = subtotal + deliveryFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
        toast.error('অনুগ্রহ করে সকল তথ্য প্রদান করুন');
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      toast.error('অনুগ্রহ করে পেমেন্ট মেথড সিলেক্ট করুন');
      return;
    }

    toast.success('অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!');
    clearCart();
    navigate('/EC/tracking');
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-xl font-bold mb-4 font-bangla">আপনার ব্যাগ খালি</h2>
        <button onClick={() => navigate('/EC')} className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold font-bangla">
          কেনাকাটা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-24">
      {/* Checkout Progress */}
      <div className="bg-white dark:bg-zinc-900 px-4 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-400'}`}>1</div>
            <span className={`text-xs font-bold font-bangla ${step >= 1 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>শিপিং</span>
          </div>
          <div className="w-8 h-px bg-zinc-100 dark:bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-400'}`}>2</div>
            <span className={`text-xs font-bold font-bangla ${step >= 2 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>পেমেন্ট</span>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-6 font-bangla">শিপিং তথ্য</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block font-bangla">নাম</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-bangla"
                    placeholder="আপনার নাম লিখুন"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block font-bangla">ফোন নাম্বার</label>
                  <input
                    type="tel"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-mono"
                    placeholder="017XXXXXXXX"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block font-bangla">জেলা</label>
                  <select
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-bangla appearance-none"
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                  >
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block font-bangla">পুরো ঠিকানা</label>
                  <textarea
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-bangla min-h-[100px]"
                    placeholder="গ্রাম/রাস্তা, পোস্ট অফিস, থানা"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 active:scale-95 transition-transform font-bangla"
            >
              পরবর্তী ধাপ
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
            {/* Order Summary Mini */}
            <div className="bg-zinc-900 dark:bg-white p-6 rounded-3xl text-white dark:text-zinc-900">
              <div className="flex justify-between items-center mb-4 opacity-60">
                <span className="text-xs font-bangla">মোট প্রদেয়</span>
                <span className="text-xs">#{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-3xl font-black">৳ {total.toLocaleString('bn-BD')}</h2>
                <span className="text-xs font-bangla opacity-60">ডেলিভারি সহ</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-2 font-bangla">পেমেন্ট মেথড</h3>

              {[
                { id: 'bkash', name: 'বিকাশ', icon: Wallet, color: 'bg-[#E2136E]' },
                { id: 'nagad', name: 'নগদ', icon: Wallet, color: 'bg-[#F7941D]' },
                { id: 'card', name: 'ডেবিট / ক্রেডিট কার্ড', icon: CreditCard, color: 'bg-zinc-800' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    paymentMethod === method.id
                      ? 'border-zinc-900 dark:border-white bg-white dark:bg-zinc-900 shadow-lg'
                      : 'border-transparent bg-white dark:bg-zinc-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center text-white`}>
                      <method.icon size={20} />
                    </div>
                    <span className="font-bold font-bangla">{method.name}</span>
                  </div>
                  {paymentMethod === method.id && <CheckCircle2 size={20} className="text-green-500" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-95 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 active:scale-95 transition-transform font-bangla"
              >
                অর্ডার নিশ্চিত করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
