import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
    // Scroll to top when the new page mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ width: "100%" }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
