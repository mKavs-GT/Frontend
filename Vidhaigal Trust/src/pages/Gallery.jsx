import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import platingDriveImg from '../assets/platingdrive.png';
import waterWellImg from '../assets/waterwell.png';
import schoolcampImg from '../assets/school.png';
import medicalCampImg from '../assets/medicalcamp.png';
import RallyImg from '../assets/awareness.png';
import womenrallyImg from '../assets/womentraining.png';

const Gallery = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const years = ['All', '2025', '2024', '2023'];

  const images = [
    { id: 1, src: platingDriveImg, alt: "Tree Planting", year: "2025" },
    { id: 2, src: schoolcampImg, alt: "Education Camp", year: "2024" },
    { id: 3, src: waterWellImg, alt: "Clean Water", year: "2025" },
    { id: 4, src: medicalCampImg, alt: "Medical Camp", year: "2023" },
    { id: 5, src: RallyImg, alt: "Awareness", year: "2024" },
    { id: 6, src: womenrallyImg, alt: "Women Training", year: "2025" }
  ];

  const filteredImages = filter === 'All' ? images : images.filter(img => img.year === filter);

  return (
    <>
      <Helmet>
        <title>{t('nav.gallery')} | Vidhaigal Trust</title>
        <meta name="description" content="View our gallery of past events and impact." />
      </Helmet>

      <main role="main" className="pt-24 pb-20 bg-beige min-h-screen">
        <section className="bg-primary py-20 text-center text-white mb-12">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold mb-4">{t('nav.gallery')}</h1>
            <p className="text-xl max-w-2xl mx-auto text-light-green">
              Capturing moments of change and smiles.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-10">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setFilter(year)}
                className={`px-5 py-2 rounded-full font-bold transition-all ${filter === year
                  ? 'bg-secondary text-text-dark shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>

          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredImages.map(img => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id}
                  className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer relative group"
                  onClick={() => setSelectedImage(img.src)}
                >
                  <img src={img.src} alt={img.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-lg">{img.alt}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-secondary p-2 transition-colors">
              <FaTimes size={32} />
            </button>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
          </div>
        )}
      </main>
    </>
  );
};

export default Gallery;
