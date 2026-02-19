export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
  isNew?: boolean;
}

export const CATEGORIES = [
  { id: 'all', name: 'সব' },
  { id: 'panjabi', name: 'পাঞ্জাবি' },
  { id: 'saree', name: 'শাড়ি' },
  { id: 'shirt', name: 'শার্ট' },
  { id: 'tshirt', name: 'টি-শার্ট' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'রয়াল এমব্রয়ডারি পাঞ্জাবি',
    price: 2500,
    category: 'panjabi',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=1000&auto=format&fit=crop',
    description: 'উন্নত মানের কটন ফ্যাব্রিক এবং চমৎকার এমব্রয়ডারি কাজ। উৎসবের জন্য উপযুক্ত।',
    sizes: ['M', 'L', 'XL', 'XXL'],
    isNew: true,
  },
  {
    id: '2',
    name: 'জমকালো জামদানি শাড়ি',
    price: 8500,
    category: 'saree',
    image: 'https://images.unsplash.com/photo-1610030469668-93510ef676f0?q=80&w=1000&auto=format&fit=crop',
    description: 'ঐতিহ্যবাহী হাতে বোনা জামদানি শাড়ি। বিশেষ অনুষ্ঠানের জন্য রাজকীয় পছন্দ।',
    sizes: ['Free Size'],
    isNew: true,
  },
  {
    id: '3',
    name: 'প্রিমিয়াম কটন শার্ট',
    price: 1800,
    category: 'shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87034a2612d?q=80&w=1000&auto=format&fit=crop',
    description: 'আরামদায়ক এবং স্টাইলিশ ফরমাল শার্ট। প্রতিদিনের ব্যবহারের জন্য সেরা।',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '4',
    name: 'গ্রাফিক প্রিন্ট টি-শার্ট',
    price: 650,
    category: 'tshirt',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    description: 'মজবুত প্রিন্ট এবং উন্নত ফেব্রিক। তারুণ্যের পছন্দের স্টাইল।',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: '5',
    name: 'সাদা ক্লাসিক পাঞ্জাবি',
    price: 1500,
    category: 'panjabi',
    image: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=1000&auto=format&fit=crop',
    description: 'সিম্পল এবং এলিগ্যান্ট সাদা পাঞ্জাবি। সব বয়সের মানুষের জন্য মানানসই।',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: '6',
    name: 'সিল্ক বেনারসি শাড়ি',
    price: 12000,
    category: 'saree',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
    description: 'অরিজিনাল সিল্ক এবং গোল্ডেন জরি কাজ। বিয়ের অনুষ্ঠানের জন্য আদর্শ।',
    sizes: ['Free Size'],
  },
  {
    id: '7',
    name: 'চেক ক্যাজুয়াল শার্ট',
    price: 1450,
    category: 'shirt',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    description: 'মডার্ন ফিট ক্যাজুয়াল শার্ট। বন্ধুদের সাথে আড্ডায় স্টাইলিশ লুক দেয়।',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: '8',
    name: 'ওভারসাইজড ব্ল্যাক টি-শার্ট',
    price: 850,
    category: 'tshirt',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    description: 'আরামদায়ক ওভারসাইজড ফিট। বর্তমানে তরুণদের মধ্যে অত্যন্ত জনপ্রিয়।',
    sizes: ['L', 'XL', 'XXL'],
  },
];
