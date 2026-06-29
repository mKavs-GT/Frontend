import React from 'react';
import { FadeIn } from './ui/FadeIn';
import add2 from '../assets/2.png';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section className="py-10 px-6 sm:px-10 md:px-16 bg-[#0C0C0C]">
      <FadeIn delay={0.1} y={30}>
        <div className="max-w-7xl mx-auto bg-[#DFA09D] rounded-[32px] overflow-hidden flex flex-col lg:flex-row items-stretch min-h-0">
          
          {/* Text Content — narrower column */}
          <div className="lg:w-5/12 p-8 sm:p-10 md:p-14 flex flex-col justify-center">
            {/* Label */}
            <span className="text-black/50 font-mono text-[10px] uppercase tracking-[0.5em] mb-4">
              Open Call — Season 03
            </span>

            <h2 className="text-black font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter italic leading-[0.95] mb-6">
              Represent<br/>Kaizoku
            </h2>

            <p className="text-black font-black text-lg sm:text-xl uppercase tracking-wider mb-2">
              Become a Model Today
            </p>

            <div className="w-10 h-[2px] bg-black/30 mb-6" />

            <div className="flex flex-col gap-5 mb-8">
              <div>
                <h3 className="text-black font-bold text-xs uppercase tracking-[0.3em] mb-1">Uncompromising Quality</h3>
                <p className="text-black/70 text-xs leading-relaxed">
                  Every stitch is a statement of rebellion. We use only high-density, over-engineered fabrics designed to survive the chaos.
                </p>
              </div>
              <div>
                <h3 className="text-black font-bold text-xs uppercase tracking-[0.3em] mb-1">Our Target</h3>
                <p className="text-black/70 text-xs leading-relaxed">
                  For the misfits, the creators, and the digital nomads who refuse to blend in. Kaizoku is for those who find beauty in the tattered.
                </p>
              </div>
            </div>

            <button className="px-8 py-3 bg-black text-white font-bold uppercase text-[10px] tracking-[0.3em] rounded-full w-fit hover:bg-white hover:text-black transition-all duration-300">
              Apply Now →
            </button>
          </div>

          {/* Image Side — wider column */}
          <div className="lg:w-7/12 min-h-[320px] lg:min-h-0 overflow-hidden">
            <img
              src={add2}
              alt="Represent Kaizoku — Become a Model"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-1000"
              style={{ minHeight: '320px' }}
            />
          </div>

        </div>
      </FadeIn>
    </section>
  );
};
