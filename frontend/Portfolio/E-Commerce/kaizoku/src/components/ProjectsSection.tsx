import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ViewAllButton } from './ui/ViewAllButton';
import { FadeIn } from './ui/FadeIn';
import { ProductImage } from './ui/ProductImage';

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
    <div className="flex flex-col gap-3 group cursor-pointer w-full">
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
    </div>
  );
};

const projects = [
  {
    num: '01',
    category: 'Silhouettes with distressed hardware',
    name: 'Jackets',
    items: [
      { id: 'jacket5', image: jacket5, name: 'Apothecary Jacket', price: '₹450.00' },
      { id: 'jacket3', image: jacket3, name: 'Sukuna Jacket', price: '₹1250.00' },
      { id: 'jacket6', image: jacket6, name: 'Nico Jacket', price: '₹850.00' },
      { id: 'jacket1', image: jacket1, name: 'Howls Jacket', price: '₹1299.00' },
    ]
  },
  {
    num: '02',
    category: 'Engineered cotton with graphic prints',
    name: 'Tops',
    items: [
      { id: 'top1', image: top1, name: 'Robin Croptop', price: '₹350.00' },
      { id: 'top2', image: top2, name: 'Leonhart Corset', price: '₹440.00' },
      { id: 'top3', image: top3, name: 'Giyyu Shirt', price: '₹330.00' },
      { id: 'top4', image: top4, name: 'Luffy Vest', price: '₹1150.00' },
    ]
  },
  {
    num: '03',
    category: 'Ethereal elegance giving girl boss energy',
    name: 'Dresses',
    items: [
      { id: 'dress1', image: dress1, name: 'Nami Minidress', price: '₹550.00' },
      { id: 'dress2', image: dress2, name: 'Boa Slipdress', price: '₹495.00' },
      { id: 'dress3', image: dress3, name: 'Frankie Shirtdress', price: '₹810.00' },
      { id: 'dress4', image: dress4, name: 'Kagegurui Minidress', price: '₹785.50' },
    ]
  }
];

interface ProjectCardProps {
  project: typeof projects[0];
  i: number;
  progress: any;
  range: [number, number];
  targetScale: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, i, progress, range, targetScale }) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="h-fit min-h-[70vh] flex items-center justify-center sticky top-[-20px] md:top-[-40px] w-full py-4 md:py-6">
      <motion.div
        style={{
          scale,
          top: `calc(${i * 20}px)`
        }}
        className="relative w-full flex flex-col rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#DFA09D]/50 bg-[#0C0C0C] p-6 sm:p-8 md:p-12 shadow-2xl"
      >
        <div className="flex justify-between items-start mb-12 gap-4">
          <div className="flex gap-6 sm:gap-10 items-center">
            <div
              className="font-black leading-none text-transparent"
              style={{
                fontSize: 'clamp(3rem, 10vw, 150px)',
                WebkitTextStroke: '2px rgba(223, 160, 157, 0.5)',
              }}
            >
              {project.num}
            </div>

            <div className="h-16 sm:h-24 md:h-32 w-[1px] bg-white/20"></div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-[1px] bg-[#DFA09D]"></span>
                <span className="uppercase text-[10px] sm:text-xs font-bold tracking-[0.4em] text-[#DFA09D]">Collection  {project.num}</span>
              </div>
              <h3 className="font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 uppercase tracking-tighter italic leading-none">
                {project.name}
              </h3>
              <p className="text-white/40 font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-widest max-w-md">
                {project.category}
              </p>
            </div>
          </div>
          <div className="hidden lg:block mt-4">
            <ViewAllButton />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full">
          {project.items.map((item, idx) => (
            <ProductItem key={idx} {...item} />
          ))}
        </div>

        <div className="lg:hidden mt-10 w-full flex justify-center">
          <ViewAllButton />
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const targetScale = 0.9;

  return (
    <section
      ref={containerRef}
      id="products"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] z-10 relative px-5 sm:px-8 md:px-10 py-20 pb-[20vh]"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 leading-none tracking-tight"
          style={{
            fontSize: 'clamp(3rem, 12vw, 160px)',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #DFA09D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Trending Today
        </h2>
      </FadeIn>

      <div className="flex flex-col gap-[10vh]">
        {projects.map((project, i) => {
          return (
            <ProjectCard
              key={i}
              project={project}
              i={i}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};
