import React from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from './ui/FadeIn';
import { ProductImage } from './ui/ProductImage';

import jacket6 from '../assets/product/jacket6.png';
import top4 from '../assets/product/top4.png';
import dress2 from '../assets/product/dress2.png';
import top3 from '../assets/product/top3.png';
import top2 from '../assets/product/top2.png';

interface InventoryItemProps {
  id: string;
  image: string;
  name: string;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ id, image, name }) => (
  <Link to="/products" className="flex flex-col gap-4 group cursor-pointer relative overflow-hidden rounded-2xl block">
    <div className="relative aspect-[4/5] overflow-hidden bg-black">
      <ProductImage
        id={id}
        alt={name}
        baseImage={image}
        className="w-full h-full"
        imgClassName="blur-[2px] opacity-60 group-hover:blur-0 group-hover:opacity-100 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4">
        <h4 className="text-[#D7E2EA] font-black text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl uppercase italic transition-all duration-500 group-hover:scale-105 group-hover:text-white tracking-[0.2em]">
          {name}
        </h4>
        <button className="px-5 py-2 border border-white text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-white hover:text-black">
          Tap to View
        </button>
      </div>
    </div>
  </Link>
);

export const InventorySection: React.FC = () => {
  const items = [
    { id: 'jacket6', image: jacket6, name: 'Jackets' },
    { id: 'top4', image: top4, name: 'Vests' },
    { id: 'dress2', image: dress2, name: 'Dresses' },
    { id: 'top3', image: top3, name: 'Shirts' },
    { id: 'top2', image: top2, name: 'Corsets' },
  ];

  return (
    <section className="px-5 sm:px-8 md:px-10 py-24 bg-[#0C0C0C]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <FadeIn delay={0.1} y={20}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 100px)',
                background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #DFA09D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Kaizoku Inventory
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <Link to="/products" className="inline-block px-8 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-[#DFA09D] hover:text-black hover:border-[#DFA09D] transition-all duration-300 rounded-full">
              EXPLORE ALL
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {items.map((item, i) => (
            <FadeIn key={i} delay={0.1 * (i + 1)} y={30}>
              <InventoryItem {...item} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
