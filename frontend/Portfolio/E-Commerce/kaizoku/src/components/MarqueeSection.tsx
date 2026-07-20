import React, { useEffect, useRef, useState } from 'react';

import img1 from '../assets/models/1.png';
import img2 from '../assets/models/2.png';
import img3 from '../assets/models/3.png';
import img4 from '../assets/models/4.png';
import img5 from '../assets/models/5.png';
import img6 from '../assets/models/6.png';
import img7 from '../assets/models/7.png';
import img8 from '../assets/models/8.png';
import img9 from '../assets/models/9.png';
import img10 from '../assets/models/10.png';
import img11 from '../assets/models/11.png';
import img12 from '../assets/models/12.png';

const rowImages1 = [img1, img2, img3, img4, img5, img6];
const rowImages2 = [img7, img8, img9, img10, img11, img12];

const row1 = [...rowImages1, ...rowImages1, ...rowImages1, ...rowImages1, ...rowImages1, ...rowImages1];
const row2 = [...rowImages2, ...rowImages2, ...rowImages2, ...rowImages2, ...rowImages2, ...rowImages2];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const calc = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calc);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calc

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
    >
      <div 
        className="flex gap-3"
        style={{ 
          transform: `translateX(${offset - 2500}px)`,
          willChange: 'transform'
        }}
      >
        {row1.map((src, i) => (
          <img 
            key={i} 
            src={src} 
            alt="Marquee" 
            loading="lazy"
            className="w-[320px] h-[210px] rounded-2xl object-cover shrink-0" 
          />
        ))}
      </div>
      
      <div 
        className="flex gap-3"
        style={{ 
          transform: `translateX(${-(offset - 200)}px)`,
          willChange: 'transform'
        }}
      >
        {row2.map((src, i) => (
          <img 
            key={i} 
            src={src} 
            alt="Marquee" 
            loading="lazy"
            className="w-[320px] h-[210px] rounded-2xl object-cover shrink-0" 
          />
        ))}
      </div>
    </section>
  );
};
