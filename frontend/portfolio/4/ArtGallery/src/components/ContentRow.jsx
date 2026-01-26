import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import ScrollReveal from './ScrollReveal';
import '../styles/ContentRow.css';

const ContentRow = ({ title, data, showProgress }) => {
    const rowRef = useRef(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction) => {
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth
                : scrollLeft + clientWidth;

            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="content-row-container">
            <ScrollReveal y={20} duration={0.5}>
                <h2 className="row-title">{title}</h2>
            </ScrollReveal>

            <div className="row-wrapper">
                <div
                    className={`slider-arrow left ${!isMoved ? 'hidden' : ''}`}
                    onClick={() => handleClick('left')}
                >
                    <FaChevronLeft />
                </div>

                <div className="row-content" ref={rowRef}>
                    {data.map((movie, index) => (
                        <MovieCard key={movie.id || index} movie={movie} showProgress={showProgress} />
                    ))}
                </div>

                <div
                    className="slider-arrow right"
                    onClick={() => handleClick('right')}
                >
                    <FaChevronRight />
                </div>
            </div>
        </div>
    );
};

export default ContentRow;
