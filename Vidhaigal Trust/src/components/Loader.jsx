import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-beige z-[100] flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg"
      >
        <span className="text-white text-3xl font-bold">V</span>
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-xl font-bold text-primary tracking-widest uppercase"
      >
        Planting Seeds...
      </motion.h2>
    </div>
  );
};

export default Loader;
