export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { id: 'saree', name: 'শাড়ি', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200' },
  { id: 'panjabi', name: 'পাঞ্জাবি', image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=200' },
  { id: 'salwar', name: 'সেলোয়ার কামিজ', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200' },
  { id: 'hijab', name: 'হিজাব ও বোরকা', image: 'https://images.unsplash.com/photo-1572944608494-81344406085a?auto=format&fit=crop&q=80&w=200' },
  { id: 'accessories', name: 'এক্সেসরিজ', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=200' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'জামদানি সুতি শাড়ি - মেরুন',
    price: 4500,
    category: 'Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=500',
    description: 'উন্নত মানের সুতি সুতা দিয়ে তৈরি আরামদায়ক জামদানি শাড়ি। উৎসব এবং ক্যাজুয়াল ব্যবহারের জন্য উপযুক্ত।',
    sizes: ['Free Size'],
    rating: 4.9
  },
  {
    id: '2',
    name: 'রয়াল এমব্রয়ডারি পাঞ্জাবি',
    price: 2500,
    category: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=500',
    description: 'প্রিমিয়াম কটন ফেব্রিক এবং চমৎকার এমব্রয়ডারি কাজ। যেকোনো অনুষ্ঠানে আপনার আভিজাত্য ফুটিয়ে তুলবে।',
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 4.8
  },
  {
    id: '3',
    name: 'ডিজাইনার সেলোয়ার কামিজ',
    price: 3800,
    category: 'Salwar',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500',
    description: 'আধুনিক ডিজাইনের থ্রি-পিস সেট। ফেব্রিক খুবই আরামদায়ক এবং কালার গ্যারান্টি।',
    sizes: ['M', 'L', 'XL'],
    rating: 4.7
  },
  {
    id: '4',
    name: 'লিনেন হিজাব - নেভি ব্লু',
    price: 850,
    category: 'Hijab',
    image: 'https://images.unsplash.com/photo-1572944608494-81344406085a?auto=format&fit=crop&q=80&w=500',
    description: 'সফট লিনেন ফেব্রিক। খুব সহজেই ব্যবহারযোগ্য এবং স্টাইলিশ।',
    sizes: ['Free Size'],
    rating: 4.6
  },
  {
    id: '5',
    name: 'সিল্ক বোরকা - ব্ল্যাক ম্যাজিক',
    price: 5500,
    category: 'Hijab',
    image: 'https://images.unsplash.com/photo-1627592518110-3151920e251b?auto=format&fit=crop&q=80&w=500',
    description: 'উন্নত মানের দুবাই সিল্ক ফেব্রিক। স্টোন এবং হাতের কাজ করা চমৎকার একটি বোরকা সেট।',
    sizes: ['52', '54', '56'],
    rating: 4.9
  },
  {
    id: '6',
    name: 'আড়ং কটন পাঞ্জাবি - হোয়াইট',
    price: 1800,
    category: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=500',
    description: '১০০% কটন ফেব্রিক। ক্লাসিক ডিজাইনের হোয়াইট পাঞ্জাবি।',
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.5
  },
  {
    id: '7',
    name: 'কাতান শাড়ি - গোল্ডেন লাক্সারি',
    price: 12000,
    category: 'Saree',
    image: 'https://images.unsplash.com/photo-1610030467221-9d823659830f?auto=format&fit=crop&q=80&w=500',
    description: 'বিয়ে এবং রিসেপশন অনুষ্ঠানের জন্য বিশেষ কাতান শাড়ি। নিখুঁত জরির কাজ।',
    sizes: ['Free Size'],
    rating: 5.0
  },
  {
    id: '8',
    name: 'হ্যান্ডক্রাফটেড মেটাল গয়না সেট',
    price: 1200,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=500',
    description: 'হাতে তৈরি আকর্ষণীয় গয়না সেট। শাড়ি বা সেলোয়ার কামিজের সাথে দারুণ মানাবে।',
    sizes: ['Free Size'],
    rating: 4.7
  },
  {
    id: '9',
    name: 'কটন ক্যাজুয়াল শার্ট',
    price: 1500,
    category: 'Panjabi',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=500',
    description: 'প্রিমিয়াম কটন শার্ট। অফিস বা ক্যাজুয়াল আউটফিট হিসেবে সেরা।',
    sizes: ['M', 'L', 'XL'],
    rating: 4.4
  },
  {
    id: '10',
    name: 'অর্গানজা ডিজিটাল প্রিন্ট শাড়ি',
    price: 3200,
    category: 'Saree',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888bb4?auto=format&fit=crop&q=80&w=500',
    description: 'ট্রেন্ডি অর্গানজা ফেব্রিক। চমৎকার ফ্লোরাল ডিজিটাল প্রিন্ট।',
    sizes: ['Free Size'],
    rating: 4.8
  }
];
