import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.8', 'end 0.2']
  });

  const chars = text.split('');

  return (
    <div ref={container} className={`${className}`}>
      <p className="relative text-justify">
        {chars.map((char, i) => {
          const start = i / chars.length;
          const end = start + (1 / chars.length);
          
          return (
            <Character 
              key={i} 
              char={char} 
              progress={scrollYProgress} 
              range={[start, end]} 
            />
          );
        })}
      </p>
    </div>
  );
};

interface CharacterProps {
  char: string;
  progress: any;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  
  return (
    <span className="relative inline-block">
      <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span 
        style={{ opacity }} 
        className="absolute left-0 top-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};
