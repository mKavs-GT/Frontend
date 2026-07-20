import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet } from './ui/Magnet';
import { ProductImage } from './ui/ProductImage';

// Middle Images (Jackets)
import maomao from '../assets/maomao.png';
import heroimg from '../assets/heroimg.png';
import maomao3 from '../assets/maomao3.png';

// Product Card Images
import jacket5 from '../assets/product/jacket5.png';
import jacket6 from '../assets/product/jacket6.png';
import jacket2 from '../assets/product/jacket2.png';

// Right Images (Decorative)
import cold from '../assets/cold.png';
import heroleft from '../assets/heroleft.png';
import kuma from '../assets/kuma.png';

const slides = [
  {
    heroImg: maomao,
    heroSize: 'w-[60vw] sm:w-[50vw] md:w-[45vw] lg:w-[40vw] max-w-[700px]',
    productImg: jacket5,
    rightImg: cold,
    bgColor: '#D590A2',
    heading: <>prescribe<br />your own<br />destiny</>,
    tagline: <>Powerful<br />Elite yours</>,
    product: {
      id: 'jacket5',
      name: 'Apothecary',
      price: '₹2900',
      desc: 'Chic touch to your daily wear tees'
    }
  },
  {
    heroImg: heroimg,
    heroSize: 'w-[50vw] sm:w-[40vw] md:w-[35vw] lg:w-[32vw] max-w-[550px]',
    productImg: jacket6,
    rightImg: heroleft,
    bgColor: '#9883BF',
    heading: <>beyond the<br />frozen<br />edge</>,
    tagline: <>absolute<br />thermal control</>,
    product: {
      id: 'jacket6',
      name: 'Glacier Shield',
      price: '₹4500',
      desc: 'Engineered for extreme performance'
    }
  },
  {
    heroImg: maomao3,
    heroSize: 'w-[75vw] sm:w-[65vw] md:w-[60vw] lg:w-[55vw] max-w-[950px]',
    productImg: jacket2,
    rightImg: kuma,
    bgColor: '#83827D',
    heading: <>silence in<br />the<br />storm</>,
    tagline: <>crafted for<br />the deep cold</>,
    product: {
      id: 'jacket2',
      name: 'Arctic Stealth',
      price: '₹3200',
      desc: 'Minimalist protection, maximum warmth'
    }
  }
];

export const ColdOpsHeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full overflow-hidden transition-colors duration-1000"
      style={{
        height: '100vh',
        backgroundColor: slide.bgColor,
        backgroundImage: `linear-gradient(to left, rgba(255,255,255,0.15) 0%, transparent 100%), linear-gradient(160deg, ${slide.bgColor} 0%, ${slide.bgColor}cc 100%)`,
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Right Side Decorative Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.4, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-[-5.2vw] top-0 h-fit w-[40vw] z-[1] pointer-events-none"
          >
            <img
              src={slide.rightImg}
              alt=""
              className="w-full h-full object-cover object-right"
            />
          </motion.div>

          {/* Center Jacket */}
          <div className="absolute inset-0 flex items-center justify-center z-[3] pointer-events-none">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="translate-y-10"
            >
              <div className="pointer-events-auto">
                <Magnet padding={200} strength={8} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
                  <img
                    src={slide.heroImg}
                    alt="Hero Product"
                    className={`${slide.heroSize} h-auto object-contain`}
                    style={{
                      filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.4))',
                    }}
                  />
                </Magnet>
              </div>
            </motion.div>
          </div>

          {/* Text/UI Overlays */}
          <div className="relative z-[2] w-full h-full flex flex-col justify-between px-6 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-14">
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-[50%] md:max-w-[40%]"
              >
                <h2
                  className="font-black uppercase leading-[0.92] tracking-tight"
                  style={{
                    fontSize: 'clamp(1.6rem, 5.5vw, 5rem)',
                    background: 'linear-gradient(90deg, #FFFFFF 40%, rgba(255,255,255,0.3) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {slide.heading}
                </h2>
              </motion.div>
            </div>

            {/* BOTTOM ROW */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-6">
                {/* Product Card */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="hidden sm:flex flex-col overflow-hidden bg-white rounded-[10px] w-[180px] md:w-[210px] shadow-2xl"
                >
                  <div className="w-full aspect-[4/5] bg-black/5">
                    <ProductImage
                      id={slide.product.id}
                      alt={slide.product.name}
                      baseImage={slide.productImg}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-3 h-[160px] justify-between">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[#1a1a1a] font-serif text-2xl leading-tight">{slide.product.name}</h4>
                      <p className="text-[#1a1a1a] text-[10px] font-bold leading-tight">
                        {slide.product.desc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                       <p className="text-[#1a1a1a] font-bold text-sm">{slide.product.price}</p>
                       <button className="px-4 py-1.5 bg-[#9A4A35] text-white text-[9px] uppercase font-bold tracking-wider hover:bg-[#853f2d] transition-colors">
                        SHOP
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col"
                >
                  <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-white/20 font-light">
                    © 2026 Kaizoku — Kowai Core
                  </p>
                </motion.div>
              </div>

              {/* Tagline */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-right max-w-[55%] sm:max-w-[50%] md:max-w-[45%]"
              >
                <p
                  className="font-black uppercase leading-[0.92] tracking-tight"
                  style={{
                    fontSize: 'clamp(1.2rem, 4.5vw, 4rem)',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, #FFFFFF 60%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {slide.tagline}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
};
