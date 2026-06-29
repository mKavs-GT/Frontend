import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { MarqueeSection } from '../components/MarqueeSection';
import { ColdOpsHeroSection } from '../components/ColdOpsHeroSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { InventorySection } from '../components/InventorySection';
import { BrandPhilosophy } from '../components/BrandPhilosophy';
import { FooterSection } from '../components/FooterSection';

export const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <ColdOpsHeroSection />
      <ProjectsSection />
      <InventorySection />
      <BrandPhilosophy />
      <FooterSection />
    </>
  );
};
