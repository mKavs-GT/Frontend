import React, { useState } from 'react';
import { destinations } from '../constants/destinations';
import { Continent, Hotspot, DestinationCategory } from '../types';
import Globe from '../components/Globe';
import ImgFallback from '../components/ImgFallback';
import ScrollReveal from '../components/ScrollReveal';

interface ExplorePageProps {
  onSelectHotspot: (hotspotName: string) => void;
}

const DestinationCard: React.FC<{ hotspot: Hotspot, onSelectHotspot: (hotspotName: string) => void, delay?: number }> = ({ hotspot, onSelectHotspot, delay = 0 }) => (
  <ScrollReveal delay={delay} direction="up">
    <div
      className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer shadow-xl transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-waypoint-primary/30 bg-waypoint-dark"
      onClick={() => onSelectHotspot(hotspot.name)}
    >
      <ImgFallback src={hotspot.image} alt={hotspot.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-waypoint-darkest via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
        <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Explore
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex items-center space-x-2 text-waypoint-accent mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <i className="fas fa-map-marker-alt text-[10px]"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{hotspot.country}</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:text-waypoint-accent transition-colors duration-300">{hotspot.name}</h3>
        <div className="w-0 group-hover:w-full h-0.5 bg-waypoint-accent transition-all duration-500 delay-200"></div>
      </div>
    </div>
  </ScrollReveal>
);

const CategorySection: React.FC<{ category: DestinationCategory, onSelectHotspot: (hotspotName: string) => void }> = ({ category, onSelectHotspot }) => (
  <div className="mb-16">
    <ScrollReveal direction="left">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">{category.name}</h3>
    </ScrollReveal>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {category.hotspots.map((hotspot: any, idx: number) => (
        <DestinationCard key={hotspot.name} hotspot={hotspot} onSelectHotspot={onSelectHotspot} delay={idx * 50} />
      ))}
    </div>
  </div>
);

const ContinentSection: React.FC<{ continent: Continent, onSelectHotspot: (hotspotName: string) => void }> = ({ continent, onSelectHotspot }) => (
  <section className="mb-20">
    <ScrollReveal>
      <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary mb-8 pb-2 border-b-2 border-waypoint-primary/30">
        {continent.name}
      </h2>
    </ScrollReveal>
    {continent.categories.map(category => (
      <CategorySection key={category.name} category={category} onSelectHotspot={onSelectHotspot} />
    ))}
  </section>
);


export default function ExplorePage({ onSelectHotspot }: ExplorePageProps) {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);

  const continentsToDisplay = selectedContinent ? [selectedContinent] : destinations;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">Explore Our World</h1>
      <p className="text-center text-lg text-gray-400 max-w-3xl mx-auto mb-12">
        Select a continent to zoom in, or click a pin to discover a new destination.
      </p>

      <Globe
        continents={destinations}
        selectedContinent={selectedContinent}
        onSelectContinent={setSelectedContinent}
        onSelectHotspot={onSelectHotspot}
      />

      <div className="mt-24">
        {continentsToDisplay.map(continent => (
          <ContinentSection key={continent.name} continent={continent} onSelectHotspot={onSelectHotspot} />
        ))}
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
