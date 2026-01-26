import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, setRating, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const starSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${starSize} transition-all duration-200 transform ${setRating ? 'cursor-pointer hover:scale-125' : ''} ${star <= (hover || rating) ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-gray-600'
            }`}
          onMouseEnter={() => setRating && setHover(star)}
          onMouseLeave={() => setRating && setHover(0)}
          onClick={() => setRating && setRating(star)}
        >
          <i className="fa-solid fa-star"></i>
        </span>
      ))}
    </div>
  );
}
