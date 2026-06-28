import React, { useEffect, useState } from 'react';
import { Hotspot } from '../types';
import ImgFallback from './ImgFallback';

interface HotspotDetailProps {
  hotspot: Hotspot;
  onClose: () => void;
}

export default function HotspotDetail({ hotspot, onClose }: HotspotDetailProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`fixed inset-0 m-auto h-[95vh] w-[95vw] max-w-7xl transform rounded-2xl bg-waypoint-darkest bg-opacity-80 backdrop-blur-xl shadow-2xl shadow-waypoint-primary/20 transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-white text-2xl z-20 hover:text-waypoint-accent transition-colors">
          <i className="fas fa-times"></i>
        </button>
        <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden rounded-2xl">
           <div className="w-full lg:w-1/2 h-1/3 lg:h-full relative bg-waypoint-dark">
            <ImgFallback src={hotspot.image} alt={hotspot.name} className="absolute inset-0 w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
             <div className="absolute bottom-0 left-0 p-8 text-white">
               <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{hotspot.name}</h1>
               <p className="text-lg text-gray-300 mt-2">{hotspot.city}, {hotspot.country}</p>
             </div>
           </div>
          <div className="w-full lg:w-1/2 h-2/3 lg:h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary mb-6">Things to Do</h2>
            <div className="space-y-6">
              {hotspot.thingsToDo.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors duration-300">
                  <ImgFallback src={activity.image} alt={activity.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-white">{activity.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
