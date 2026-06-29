import React, { useState, useEffect, useRef } from 'react';

interface ProductImageProps {
  id: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  baseImage?: string; 
}

export const ProductImage: React.FC<ProductImageProps> = ({ id, alt, className, imgClassName, baseImage }) => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Construct image URLs
  const images = {
    main: baseImage || new URL(`../../assets/product/${id}.png`, import.meta.url).href,
    model: new URL(`../../assets/product/${id}model.png`, import.meta.url).href,
    character: new URL(`../../assets/product/${id}C.jpg`, import.meta.url).href,
  };

  useEffect(() => {
    if (!isHovered) {
      setCurrentImage(images.main);
    }
  }, [images.main, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCurrentImage(images.model);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setCurrentImage(images.character);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImage(images.main);
    
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={currentImage}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${imgClassName || ''}`}
      />
    </div>
  );
};
