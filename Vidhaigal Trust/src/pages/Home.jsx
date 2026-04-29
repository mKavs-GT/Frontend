import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import ImpactCounter from '../components/ImpactCounter';
import InitiativeCard from '../components/InitiativeCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  const featuredInitiatives = [
    {
      id: 1,
      title: "Green Canopy Project",
      description: "Planting 100,000 native trees across urban landscapes to combat climate change and improve air quality.",
      image: "https://placehold.co/600x400/2D6A4F/FFF?text=Tree+Planting",
      category: "Environment",
      progress: 75
    },
    {
      id: 2,
      title: "Rural Education Initiative",
      description: "Providing digital classrooms and learning materials to underprivileged children in remote villages.",
      image: "https://placehold.co/600x400/F4C430/1A1A1A?text=Education",
      category: "Education",
      progress: 40
    },
    {
      id: 3,
      title: "Clean Water Access",
      description: "Building sustainable water purification systems for communities lacking access to safe drinking water.",
      image: "https://placehold.co/600x400/D8F3DC/1A1A1A?text=Clean+Water",
      category: "Health",
      progress: 90
    }
  ];

  const testimonials = [
    { id: 1, quote: "Vidhaigal Trust transformed our village by providing clean water. Their dedication is unmatched.", name: "Sunitha R.", role: "Village Head" },
    { id: 2, quote: "The tree planting drive was incredibly well organized. Proud to be a volunteer!", name: "Karthik P.", role: "Volunteer" },
    { id: 3, quote: "Thanks to their education initiative, my children now have access to digital learning.", name: "Lakshmi M.", role: "Beneficiary" }
  ];

  const news = [
    { id: 1, title: "10,000 Saplings Planted in Chennai", date: "April 15, 2026", image: "https://placehold.co/400x250/2D6A4F/FFF?text=News+1" },
    { id: 2, title: "New Digital Classroom Inaugurated", date: "March 28, 2026", image: "https://placehold.co/400x250/F4C430/1A1A1A?text=News+2" },
    { id: 3, title: "Medical Camp Reaches 500 Families", date: "March 10, 2026", image: "https://placehold.co/400x250/D8F3DC/1A1A1A?text=News+3" }
  ];

  const partners = [1, 2, 3, 4, 5];

  return (
    <>
      <Helmet>
        <title>{t('nav.home')} | Vidhaigal Trust</title>
        <meta name="description" content={t('hero.subtitle')} />
      </Helmet>

      <main role="main">
        <HeroSection />
        <ImpactCounter />

        {/* About Snapshot Section */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-secondary rounded-2xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://placehold.co/800x600/2D6A4F/FFF?text=About+Vidhaigal" 
                  alt="About Us" 
                  className="relative z-10 rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Who We Are</h2>
                <h3 className="text-4xl font-extrabold text-text-dark mb-6">{t('about.snapshotTitle')}</h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('about.mission')}
                </p>
                <Link 
                  to="/about"
                  className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-green-800 transition-colors"
                  aria-label="Read more about Vidhaigal Trust"
                >
                  {t('about.readMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Initiatives Section */}
        <section className="py-20 bg-light-green/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Our Work</h2>
              <h3 className="text-4xl font-extrabold text-text-dark">{t('initiatives.title')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredInitiatives.map((initiative, index) => (
                <InitiativeCard key={initiative.id} initiative={initiative} index={index} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link 
                to="/initiatives"
                className="inline-block px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors"
                aria-label="View all our initiatives"
              >
                View All Initiatives
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Voices of Impact</h2>
              <h3 className="text-4xl font-extrabold text-text-dark">What People Say</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                  <span className="absolute -top-4 -left-2 text-6xl text-light-green opacity-50 font-serif">"</span>
                  <p className="text-gray-600 mb-6 italic relative z-10">{item.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-dark">{item.name}</h4>
                      <p className="text-sm text-primary font-medium">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-20 bg-beige border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Stay Updated</h2>
              <h3 className="text-4xl font-extrabold text-text-dark">Latest News</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-primary font-bold mb-2 block">{item.date}</span>
                    <h4 className="text-xl font-bold text-text-dark mb-4 group-hover:text-primary transition-colors">{item.title}</h4>
                    <Link to="#" className="text-secondary font-bold hover:underline">Read More →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Strip */}
        <section className="py-12 bg-beige border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h4 className="text-center text-gray-500 font-semibold mb-8 uppercase tracking-widest text-sm">Supported By</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {partners.map(num => (
                <img key={num} src={`https://placehold.co/150x60/E5E7EB/9CA3AF?text=Partner+${num}`} alt={`Partner ${num}`} className="grayscale hover:grayscale-0 transition-all duration-300" />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold mb-6">Join Our Newsletter</h2>
            <p className="text-lg text-light-green mb-10">Subscribe to get our latest news, project updates, and impact stories delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={e => e.preventDefault()}>
              <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="Enter your email address" 
                required 
                className="px-6 py-4 rounded-full w-full sm:w-2/3 text-text-dark outline-none focus:ring-4 focus:ring-light-green"
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-secondary text-text-dark font-bold rounded-full hover:bg-yellow-400 transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
