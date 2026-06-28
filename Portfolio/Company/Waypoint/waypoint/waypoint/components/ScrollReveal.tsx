
import React, { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = '',
    direction = 'up',
    delay = 0
}) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('reveal-active');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [delay]);

    const getDirectionClass = () => {
        switch (direction) {
            case 'up': return 'reveal-up';
            case 'down': return 'reveal-down';
            case 'left': return 'reveal-left';
            case 'right': return 'reveal-right';
            default: return 'reveal-fade';
        }
    };

    return (
        <div
            ref={elementRef}
            className={`reveal-init ${getDirectionClass()} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
