"use client";
import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, type MotionValue, useSpring } from "framer-motion";

export const ContainerScroll = ({
    titleComponent,
    children,
}: {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"],
    });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.65, 0.95] : [1.1, 1];
    };

    // Enhanced animations with spring physics for smoother motion
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // More dramatic 3D rotation (with smooth spring)
    const rotate = useTransform(smoothProgress, [0, 1], [35, 0]);

    // Improved scale curve with better transition (with smooth spring)
    const scale = useTransform(smoothProgress, [0, 1], scaleDimensions());

    // Enhanced Y-axis translation for more dynamic motion (with smooth spring)
    const translate = useTransform(smoothProgress, [0, 1], [0, -120]);

    // Opacity transition - instant response to scroll (no spring delay)
    const opacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [0.2, 0.7, 1]);

    // Blur effect - instant response to scroll (no spring delay)
    const blur = useTransform(scrollYProgress, [0, 0.5, 0.7], [8, 2, 0]);

    return (
        <div
            className="h-[85rem] md:h-[90rem] flex items-center justify-center relative p-2 md:p-20"
            ref={containerRef}
            style={{ position: 'relative' }}
        >
            <div
                className="py-10 md:py-40 w-full relative"
                style={{
                    perspective: "1500px", // Increased perspective for more depth
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card
                    rotate={rotate}
                    translate={translate}
                    scale={scale}
                    opacity={opacity}
                    blur={blur}
                    scrollProgress={smoothProgress}
                >
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent }: {
    translate: MotionValue<number>;
    titleComponent: string | React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="div max-w-5xl mx-auto text-center"
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    opacity,
    blur,
    scrollProgress,
    children,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    opacity: MotionValue<number>;
    blur: MotionValue<number>;
    scrollProgress: MotionValue<number>;
    children: React.ReactNode;
}) => {
    // Dynamic shadow intensity based on scroll progress
    const shadowIntensity = useTransform(
        scrollProgress,
        [0, 1],
        [0.3, 1]
    );

    // Convert blur MotionValue to filter string for reactive updates
    const blurFilter = useTransform(blur, (val) => `blur(${val}px)`);

    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                opacity,
                filter: blurFilter,
            }}
            className="max-w-5xl -mt-12 mx-auto h-[58rem] md:h-[45rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] relative"
        >
            {/* Animated border glow effect */}
            <motion.div
                className="absolute -inset-[2px] rounded-[30px] opacity-0 pointer-events-none"
                style={{
                    opacity: shadowIntensity,
                    background: 'linear-gradient(135deg, rgba(198, 255, 0, 0.3), rgba(0, 18, 255, 0.3))',
                    filter: 'blur(10px)',
                }}
            />

            {/* Enhanced multi-layer shadow */}
            <motion.div
                className="absolute inset-0 rounded-[30px] pointer-events-none"
                style={{
                    opacity: shadowIntensity,
                    boxShadow: `
                        0 0 20px rgba(198, 255, 0, 0.2),
                        0 10px 30px rgba(0, 0, 0, 0.4),
                        0 20px 50px rgba(0, 0, 0, 0.3),
                        0 50px 80px rgba(0, 0, 0, 0.2),
                        0 100px 120px rgba(0, 0, 0, 0.1)
                    `,
                }}
            />

            <div className="relative z-10 h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
                {children}
            </div>
        </motion.div>
    );
};
