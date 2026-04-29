import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBgImg from '../assets/hero_bg.png';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/60 z-10"></div> {/* Green overlay */}
        <img 
          src={heroBgImg} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 z-20 text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg"
        >
          {t('hero.title')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light drop-shadow-md"
        >
          {t('hero.subtitle')}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            to="/about" 
            className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-1"
          >
            {t('hero.getInvolved')}
          </Link>
          <Link 
            to="/donate" 
            className="px-8 py-4 bg-secondary text-text-dark rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg transform hover:-translate-y-1"
          >
            {t('hero.donateNow')}
          </Link>
        </motion.div>
      </div>

      {/* Wave shape divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.28,200.7,114.5,241.6,110.5,282.4,98.6,321.39,56.44Z" fill="var(--color-accent)"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
