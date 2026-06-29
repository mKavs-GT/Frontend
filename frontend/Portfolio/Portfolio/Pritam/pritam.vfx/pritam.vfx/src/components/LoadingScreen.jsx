import { motion } from 'framer-motion';
import Logo from './Logo';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
        >
            <div className="loading-screen__content">
                <motion.div
                    className="loading-screen__logo"
                    initial="initial"
                    animate="loop"
                    variants={{
                        initial: { scale: 0.8, opacity: 0 },
                        loop: {
                            scale: [1, 1.05, 1],
                            opacity: 1,
                            transition: {
                                scale: {
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 0.8 }
                            }
                        }
                    }}
                >
                    <Logo size={100} />
                </motion.div>

                <motion.div
                    className="loading-screen__text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <span className="loading-screen__brand">pritam.vfx</span>
                    <div className="loading-screen__progress-container">
                        <motion.div
                            className="loading-screen__progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Background elements to match site theme */}
            <div className="loading-screen__bg">
                <div className="loading-screen__gradient loading-screen__gradient--1"></div>
                <div className="loading-screen__gradient loading-screen__gradient--2"></div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
