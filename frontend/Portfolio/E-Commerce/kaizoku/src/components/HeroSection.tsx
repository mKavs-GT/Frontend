import React from 'react';
import { FadeIn } from './ui/FadeIn';
import { Magnet } from './ui/Magnet';
import { ContactButton } from './ui/ContactButton';
import heroImg from '../assets/heroimg.png';
import heroLeft from '../assets/heroleft.png';
import { Navbar } from './Navbar';

export const HeroSection: React.FC = () => {
  return (
    <section className="h-screen flex flex-col overflow-x-clip relative">
      <div
        className="absolute left-[-6vw] top-10 h-fit w-[30vw] z-[0] pointer-events-none"
        style={{
          opacity: 0.6,
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)'
        }}
      >
        <img
          src={heroLeft}
          alt=""
          className="w-full h-full object-cover object-left"
        />
      </div>
      {/* Navbar */}
      <Navbar />

      {/* Heading */}
      <div className="flex-1 flex flex-col justify-between w-full relative z-0">
        <div className="overflow-hidden w-full flex justify-center mt-6 sm:mt-4 md:-mt-5">
          <FadeIn delay={0.15} y={40} className="w-full text-center">
            <h1
              className="hero-heading font-black tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
              style={{
                background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #DFA09D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              KAiZOKU
            </h1>
          </FadeIn>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-start items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 w-full z-20">
          <div className="flex flex-col gap-4">
            <FadeIn delay={0.5} y={20}>
              <ContactButton />
            </FadeIn>
            <FadeIn delay={0.35} y={20}>
              <p
                className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
                style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
              >
                A tribute to the beautiful anomalies
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Portrait */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-[70%] -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 z-10 w-[200px] sm:w-[280px] md:w-[340px] lg:w-[400px]"
      >
        <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" maxX={0} maxY={0}>
          <img
            src={heroImg}
            alt="Hero Portrait"
            className="w-full h-auto object-cover"
          />
        </Magnet>
      </FadeIn>
    </section>
  );
};
