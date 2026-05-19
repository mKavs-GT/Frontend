import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({
    children,
    width = "100%",
    delay = 0,
    duration = 0.5,
    y = 20,
    x = 0,
    opacity = 0,
    scale = 1,
    once = true
}) => {
    return (
        <motion.div
            initial={{ opacity, y, x, scale }}
            whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            viewport={{ once, amount: 0.1 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1.0] // Clean cubic-bezier for premium feel
            }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
