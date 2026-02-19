import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Truck, Search, Menu, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from './CartContext';

interface HeeraLayoutProps {
  children: React.ReactNode;
}

const HeeraLayout: React.FC<HeeraLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const isHome = location.pathname === '/EC' || location.pathname === '/EC/';

  const navItems = [
    { icon: Home, label: 'হোম', path: '/EC' },
    { icon: Grid, label: 'ক্যাটাগরি', path: '/EC/category/all' },
    { icon: Truck, label: 'ট্র্যাকিং', path: '/EC/tracking' },
    { icon: ShoppingBag, label: 'ব্যাগ', path: '/EC/cart' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-bangla text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link to="/EC" className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white dark:border-zinc-900 rotate-45" />
              </div>
              হীরা স্টোর
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/EC/search" className="p-2">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/EC/cart" className="p-2 relative">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] flex items-center justify-center rounded-full font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/EC' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                  {item.path === '/EC/cart' && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default HeeraLayout;
