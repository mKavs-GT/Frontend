import React, { useEffect, useState } from 'react';

interface ImgFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | undefined;
  fallback?: string;
}

const ImgFallback: React.FC<ImgFallbackProps> = ({ src, fallback, alt, ...rest }) => {
  const defaultFallback = fallback || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(typeof src === 'string' ? src : undefined);
  const [hasErrored, setHasErrored] = useState(false);

  useEffect(() => {
    setCurrentSrc(typeof src === 'string' ? src : undefined);
    setHasErrored(false);
  }, [src]);

  const handleError = () => {
    if (!hasErrored) {
      setCurrentSrc(defaultFallback);
      setHasErrored(true);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={currentSrc} alt={alt} onError={handleError} {...rest} />
  );
};

export default ImgFallback;
