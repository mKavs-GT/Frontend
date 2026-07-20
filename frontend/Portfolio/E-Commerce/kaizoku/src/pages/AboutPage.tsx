import React, { useEffect } from 'react';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { FooterSection } from '../components/FooterSection';
import { Navbar } from '../components/Navbar';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0C0C0C] min-h-screen">
      <Navbar />
      <AboutSection />
      <ServicesSection />
      <FooterSection />
    </div>
  );
};
