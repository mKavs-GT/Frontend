import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaTree, FaHeart, FaTasks, FaUsers } from 'react-icons/fa';

const Counter = ({ end, duration = 2, label, icon }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const endValue = parseInt(end.toString().replace(/,/g, ''));
      if (start === endValue) return;

      const incrementTime = (duration / endValue) * 1000;
      let timer = setInterval(() => {
        start += Math.ceil(endValue / (duration * 60)); // 60fps roughly
        if (start > endValue) start = endValue;
        setCount(start);
        if (start === endValue) clearInterval(timer);
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [end, duration, isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="w-16 h-16 bg-light-green text-primary rounded-full flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 aria-live="polite" className="text-4xl font-extrabold text-text-dark mb-2">
        {count.toLocaleString()}+
      </h3>
      <p className="text-gray-600 font-medium text-center">{label}</p>
    </motion.div>
  );
};

const ImpactCounter = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-beige relative z-10 -mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Counter end={50000} label={t('impact.seedsPlanted')} icon={<FaTree />} />
          <Counter end={12000} label={t('impact.livesTouched')} icon={<FaHeart />} />
          <Counter end={350} label={t('impact.projectsCompleted')} icon={<FaTasks />} />
          <Counter end={1500} label={t('impact.volunteers')} icon={<FaUsers />} />
        </div>
      </div>
    </section>
  );
};

export default ImpactCounter;
