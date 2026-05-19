import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import BrandCTA from './components/BrandCTA';
import Footer from './components/Footer';
import { projects, projectCategories } from './data/projects';

function App() {
  const portfolioSites = projects.filter(p => p.category === projectCategories.PORTFOLIO);
  const ecommerceSites = projects.filter(p => p.category === projectCategories.ECOMMERCE);
  const companySites = projects.filter(p => p.category === projectCategories.COMPANY);
  const portalSites = projects.filter(p => p.category === projectCategories.PORTAL);

  const Section = ({ id, title, items, className = "" }) => (
    <div className={`mb-32 scroll-mt-32 ${className}`} id={id}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-gray-400 mb-10 uppercase">
        {title}
      </h2>
      <div className="flex flex-col gap-10 md:gap-12">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* main container: removed pb-32 to eliminate gap before footer */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-20 pt-12 md:pt-16 flex flex-col">
        <Header />
        
        {/* Brand CTA - The pinned section */}
        <div className="relative z-10">
          <BrandCTA />
        </div>
        
        <Section id="portfolio" title={projectCategories.PORTFOLIO} items={portfolioSites} className="mt-40 md:mt-60" />
        <Section id="ecommerce" title={projectCategories.ECOMMERCE} items={ecommerceSites} />
        <Section id="company" title={projectCategories.COMPANY} items={companySites} />
        <Section id="portal" title={projectCategories.PORTAL} items={portalSites} />
      </main>

      {/* Footer is outside the max-width main container to be full width like pricing page */}
      <Footer />
    </div>
  );
}

export default App;
