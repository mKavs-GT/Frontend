import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const InitiativeCard = ({ initiative, index }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={initiative.image} 
          alt={initiative.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-secondary text-text-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {initiative.category}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-text-dark mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {initiative.title}
        </h3>
        <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
          {initiative.description}
        </p>
        
        {initiative.progress !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="text-primary">Progress</span>
              <span className="text-gray-700">{initiative.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${initiative.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-primary h-2.5 rounded-full"
              ></motion.div>
            </div>
          </div>
        )}
        
        <Link 
          to={`/initiatives`} 
          className="inline-block text-center w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
          aria-label={`${t('initiatives.learnMore')} about ${initiative.title}`}
        >
          {t('initiatives.learnMore')}
        </Link>
      </div>
    </motion.div>
  );
};

export default InitiativeCard;
