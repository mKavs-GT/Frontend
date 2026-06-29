import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 40, className = "" }) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`logo-svg ${className}`}
        >
            {/* Smooth Rounded Square (Squircle-ish) */}
            <motion.rect
                x="5" y="5" width="90" height="90" rx="28" fill="white"
                variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.05 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />

            {/* Clapperboard Body */}
            <rect x="28" y="48" width="44" height="28" rx="2" fill="#2A2A2A" />

            {/* Clapperboard Top (Animate from Open to Shut) */}
            <motion.g
                variants={{
                    initial: { rotate: -15, x: 28, y: 36 },
                    hover: { rotate: 0, x: 28, y: 38 },
                    loop: {
                        rotate: [-15, 0, -15],
                        x: [28, 28, 28],
                        y: [36, 38, 36],
                        transition: {
                            rotate: { repeat: Infinity, duration: 1, ease: "easeInOut" },
                            y: { repeat: Infinity, duration: 1, ease: "easeInOut" }
                        }
                    }
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    mass: 0.8
                }}
                style={{ transformOrigin: '0px 10px' }}
            >
                <rect x="0" y="0" width="44" height="10" rx="2" fill="#2A2A2A" />
                {/* Stripes */}
                <path d="M8 0L14 10H20L14 0H8Z" fill="white" fillOpacity="0.6" />
                <path d="M22 0L28 10H34L28 0H22Z" fill="white" fillOpacity="0.6" />
                <path d="M36 0L42 10H44V7L40 0H36Z" fill="white" fillOpacity="0.6" />
            </motion.g>

            {/* Pivot Point */}
            <circle cx="28" cy="46" r="1.5" fill="#2A2A2A" />
        </motion.svg>
    );
};

export default Logo;
