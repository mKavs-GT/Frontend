import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FooterSection } from '../components/FooterSection';
import { FadeIn } from '../components/ui/FadeIn';
import { ProductImage } from '../components/ui/ProductImage';

import model2 from '../assets/2.png';
import jacketsImg from '../assets/jackets.png';
import vestsImg from '../assets/vests.png';
import dressesImg from '../assets/dresses.png';
import shirtsImg from '../assets/shirts.png';

import jacket1 from '../assets/product/jacket1.png';
import jacket2 from '../assets/product/jacket2.png';
import jacket3 from '../assets/product/jacket3.png';
import jacket4 from '../assets/product/jacket4.png';
import jacket5 from '../assets/product/jacket5.png';
import jacket6 from '../assets/product/jacket6.png';
import top1 from '../assets/product/top1.png';
import top2 from '../assets/product/top2.png';
import top3 from '../assets/product/top3.png';
import top4 from '../assets/product/top4.png';
import dress1 from '../assets/product/dress1.png';
import dress2 from '../assets/product/dress2.png';
import dress3 from '../assets/product/dress3.png';
import dress4 from '../assets/product/dress4.png';

const ProductItem: React.FC<{ id: string, image: string, name: string, price: string }> = ({ id, image, name, price }) => {
  const navigate = useNavigate();

  return (
    <Link to={`/product/${id}`} className="flex flex-col gap-3 group cursor-pointer w-full">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] sm:rounded-[30px] bg-[#1A1A1A] w-full">
        <ProductImage
          id={id}
          alt={name}
          baseImage={image}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col items-start w-full gap-1">
        <h4 className="text-[#D7E2EA] font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight truncate w-full">{name}</h4>
        <p className="text-[#D7E2EA] font-medium text-[11px] sm:text-[13px] md:text-[15px] opacity-80">{price}</p>
        <button 
          onClick={(e) => { e.preventDefault(); navigate('/checkout'); }}
          className="w-full py-2.5 mt-1 bg-[#DFA09D] text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-white transition-colors duration-300 rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

const CategoryPill: React.FC<{ name: string, img: string, color: string, delay: number, href: string }> = ({ name, img, color, delay, href }) => (
  <FadeIn delay={delay} y={30} className="relative group cursor-pointer h-[130px] w-full max-w-[360px]">
    <a href={href} className="block w-full h-full relative">
      <div className={`absolute bottom-0 left-0 w-full h-[84px] rounded-[42px] ${color} transition-all duration-500 group-hover:shadow-2xl flex items-center px-10 overflow-hidden`}>
        <div className="flex flex-col gap-1 z-10">
          <h4 className="text-black font-black text-lg sm:text-xl uppercase tracking-tighter italic leading-none">{name}</h4>
          <div className="px-4 py-1.5 mt-1 border border-black/30 text-black text-[8px] font-bold uppercase tracking-[0.2em] rounded-full w-fit group-hover:bg-black group-hover:text-white transition-all duration-300">
            Click Now
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-[-5px] w-[110px] h-[150px] z-20 pointer-events-none">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain object-bottom"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
        />
      </div>
    </a>
  </FadeIn>
);

const categoryData = [
  {
    id: 'jackets',
    title: 'Jackets',
    items: [
      { id: 'jacket5', image: jacket5, name: 'Apothecary Jacket', price: '₹450.00' },
      { id: 'jacket3', image: jacket3, name: 'Sukuna Jacket', price: '₹1250.00' },
      { id: 'jacket6', image: jacket6, name: 'Nico Jacket', price: '₹850.00' },
      { id: 'jacket1', image: jacket1, name: 'Howls Jacket', price: '₹1299.00' },
      { id: 'jacket2', image: jacket2, name: 'Arctic Shell', price: '₹1150.00' },
      { id: 'jacket4', image: jacket4, name: 'Frost Byte', price: '₹950.00' },
    ]
  },
  {
    id: 'tops',
    title: 'Tops',
    items: [
      { id: 'top1', image: top1, name: 'Robin Croptop', price: '₹350.00' },
      { id: 'top2', image: top2, name: 'Leonhart Corset', price: '₹440.00' },
      { id: 'top3', image: top3, name: 'Giyyu Shirt', price: '₹330.00' },
      { id: 'top4', image: top4, name: 'Luffy Vest', price: '₹1150.00' },
    ]
  },
  {
    id: 'dresses',
    title: 'Dresses',
    items: [
      { id: 'dress1', image: dress1, name: 'Nami Minidress', price: '₹550.00' },
      { id: 'dress2', image: dress2, name: 'Boa Slipdress', price: '₹495.00' },
      { id: 'dress3', image: dress3, name: 'Frankie Shirtdress', price: '₹810.00' },
      { id: 'dress4', image: dress4, name: 'Kagegurui Minidress', price: '₹785.50' },
    ]
  }
];

export const ProductsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={model2} className="w-full h-full object-cover opacity-60" alt="Products Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0C0C0C]"></div>
        </div>

        <div className="relative z-10 text-center px-6 mt-20">
          <FadeIn delay={0.1} y={30}>
            <span className="text-[#DFA09D] font-mono text-sm uppercase tracking-[0.5em] mb-4 block">New Collection 2026</span>
            <h1
              className="text-white font-black text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl uppercase tracking-tighter leading-none mb-10 italic drop-shadow-2xl whitespace-nowrap"
              style={{ wordSpacing: '1rem' }}
            >
              Wear the Rebellion
            </h1>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-12 py-5 bg-[#DFA09D] text-black font-black text-xs sm:text-sm uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 rounded-full shadow-2xl"
            >
              Shop Collection
            </button>
          </FadeIn>
        </div>
      </section>

      <div className="bg-white py-5 overflow-hidden border-y border-white/10 relative z-10">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-black font-black text-xs sm:text-sm uppercase tracking-[0.4em]">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              Wear the Basics <span className="text-[#DFA09D]">✦</span> Inspire Your Every Day <span className="text-[#DFA09D]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-24 px-6 sm:px-10 md:px-16 max-w-[1400px] mx-auto overflow-visible">
        <FadeIn delay={0.1} y={20} className="mb-12 text-center">
          <h2 className="text-white font-black text-4xl uppercase tracking-widest italic">Shop by Categories</h2>
          <div className="w-20 h-1 bg-[#DFA09D] mx-auto mt-4"></div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center mb-40">
          <CategoryPill name="Jackets" img={jacketsImg} color="bg-[#F0A0A0]" delay={0.1} href="#jackets" />
          <CategoryPill name="Tops" img={shirtsImg} color="bg-[#EBC070]" delay={0.2} href="#tops" />
          <CategoryPill name="Dresses" img={dressesImg} color="bg-[#E0D5D5]" delay={0.3} href="#dresses" />
        </div>

        <div className="flex flex-col gap-32">
          {categoryData.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-32">
              <FadeIn delay={0.1} y={20} className="mb-8 flex items-center gap-4">
                <h3 className="text-white/20 font-medium text-xs sm:text-sm uppercase tracking-[0.6em] whitespace-nowrap">{category.title}</h3>
                <div className="h-[1px] w-full bg-white/5"></div>
              </FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
                {category.items.map((item, idx) => (
                  <FadeIn key={idx} delay={0.05 * idx} y={20}>
                    <ProductItem {...item} />
                  </FadeIn>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};
