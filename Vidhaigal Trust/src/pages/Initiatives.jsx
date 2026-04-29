import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import InitiativeCard from '../components/InitiativeCard';

const Initiatives = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Education', 'Environment', 'Community', 'Health'];

  const allInitiatives = [
    {
      id: 1, title: "Green Canopy Project", description: "Planting 100,000 native trees across urban landscapes.", image: "https://placehold.co/600x400/2D6A4F/FFF?text=Environment", category: "Environment", progress: 75
    },
    {
      id: 2, title: "Rural Education Initiative", description: "Providing digital classrooms to remote villages.", image: "https://placehold.co/600x400/F4C430/1A1A1A?text=Education", category: "Education", progress: 40
    },
    {
      id: 3, title: "Clean Water Access", description: "Building sustainable water purification systems.", image: "https://placehold.co/600x400/D8F3DC/1A1A1A?text=Health", category: "Health", progress: 90
    },
    {
      id: 4, title: "Women Empowerment Skills", description: "Vocational training for women to start micro-businesses.", image: "https://placehold.co/600x400/2D6A4F/FFF?text=Community", category: "Community", progress: 55
    },
    {
      id: 5, title: "Plastic-Free Coasts", description: "Beach cleanup drives and plastic recycling plants.", image: "https://placehold.co/600x400/2D6A4F/FFF?text=Environment", category: "Environment", progress: 30
    },
    {
      id: 6, title: "Mobile Health Clinics", description: "Free medical checkups for underserved areas.", image: "https://placehold.co/600x400/D8F3DC/1A1A1A?text=Health", category: "Health", progress: 65
    }
  ];

  const filteredInitiatives = filter === 'All' 
    ? allInitiatives 
    : allInitiatives.filter(i => i.category === filter);

  return (
    <>
      <Helmet>
        <title>{t('nav.initiatives')} | Vidhaigal Trust</title>
        <meta name="description" content="Explore our various initiatives." />
      </Helmet>

      <main role="main" className="pt-24 pb-20 bg-beige min-h-screen">
        <section className="bg-primary py-20 text-center text-white mb-12">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold mb-4">{t('nav.initiatives')}</h1>
            <p className="text-xl max-w-2xl mx-auto text-light-green">
              Our active programs dedicated to making a lasting impact.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  filter === cat 
                    ? 'bg-secondary text-text-dark shadow-md scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInitiatives.map((initiative, index) => (
              <InitiativeCard key={initiative.id} initiative={initiative} index={index} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Initiatives;
