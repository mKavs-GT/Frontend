"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

import { motion } from "framer-motion";

export function BrandingPage() {
    return (
        <div className="w-full bg-gradient-to-b from-[#333333] via-[#2a2a2a] to-[#222222] overflow-hidden">
            {/* Floating Shapes Background */}
            <FloatingShapes />

            {/* Hero Section with Scroll Animation */}
            <ContainerScroll
                titleComponent={
                    <div className="space-y-6 px-4 pt-16 md:pt-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-black text-white"
                        >
                            Let's <span className="text-[#C6FF00]">BRAND</span>
                            <br />
                            Your Website
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto font-light italic"
                        >
                            Your website deserves a look that hits instantly — colors that vibe,
                            fonts that speak, and a style that feels you. We don't guess.
                            We design with intention.
                        </motion.p>
                    </div>
                }
            >
                <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#333333] to-[#1a1a1a]">
                    {/* Branding Services Grid with Vibrant Redesign */}
                    <div className="grid md:grid-cols-2 gap-6 p-4 md:p-8 flex-grow">
                        {/* Color Palette Card */}
                        <motion.div
                            whileHover={{ scale: 1.03, y: -8 }}
                            className="relative overflow-hidden rounded-3xl group cursor-pointer h-full"
                            style={{ background: 'linear-gradient(135deg, #0012FF 0%, #0018CC 100%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C6FF00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#C6FF00] flex items-center justify-center">
                                            <svg className="w-7 h-7" fill="none" stroke="#0012FF" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="3" />
                                                <path d="M12 1v6m0 6v6m5.657-13.657l-4.243 4.243m0 4.828l-4.242 4.242M23 12h-6m-6 0H1m17.657 5.657l-4.243-4.243m0-4.828l-4.242-4.242" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-black text-white">Color Palettes</h3>
                                    </div>

                                    <p className="text-white/90 text-sm md:text-lg leading-relaxed">We craft custom palettes based on your energy, your audience, and the message you wanna send.</p>
                                    <p className="text-[#C6FF00] font-semibold text-base md:text-lg">Bold? Minimal? Playful? Premium?</p>
                                    <p className="text-white/80 text-sm leading-relaxed hidden md:block">We build colors that define your brand — not just decorate it.</p>
                                </div>

                                <a
                                    href="/brandpg/colopg/color.html"
                                    className="mt-6 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-[#C6FF00] text-[#0012FF] rounded-full font-black text-base md:text-lg hover:bg-white hover:shadow-[0_0_30px_rgba(198,255,0,0.8)] transition-all duration-300 transform hover:scale-105 inline-block text-center"
                                >
                                    Check Color Palette →
                                </a>
                            </div>
                        </motion.div>

                        {/* Typography Card */}
                        <motion.div
                            whileHover={{ scale: 1.03, y: -8 }}
                            className="relative overflow-hidden rounded-3xl group cursor-pointer h-full"
                            style={{ background: 'linear-gradient(135deg, #C6FF00 0%, #9FCC00 100%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0012FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#0012FF] flex items-center justify-center">
                                            <svg className="w-7 h-7" fill="none" stroke="#C6FF00" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-black text-[#0012FF]">Typography</h3>
                                    </div>

                                    <p className="text-[#0012FF]/90 text-sm md:text-lg leading-relaxed font-medium">Typography sets the tone.</p>
                                    <p className="text-[#0012FF] text-sm md:text-base leading-relaxed">Clean, modern, classy, loud, soft — we pick fonts that match your brand's personality.</p>
                                </div>

                                <a
                                    href="../fontspg/fonts.html"
                                    className="mt-6 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-[#0012FF] text-[#C6FF00] rounded-full font-black text-base md:text-lg hover:bg-[#000A88] hover:shadow-[0_0_30px_rgba(0,18,255,0.8)] transition-all duration-300 transform hover:scale-105">
                                    Check Fonts →
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Integrated CTA Section inside Card */}
                    <div className="relative py-8 md:py-10 px-4 text-center overflow-hidden shrink-0">
                        <div className="relative z-10">

                        </div>
                        {/* Decorative Wave as background for this bottom section */}
                        <div className="absolute bottom-0 left-0 right-0 opacity-0">
                            <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-32 md:h-auto object-cover">
                                <path d="M0 100C240 30 480 30 720 100C960 170 1200 170 1440 100V200H0V100Z" fill="#C6FF00" />
                            </svg>
                        </div>
                    </div>
                </div>
            </ContainerScroll>

            {/* Footer Social Section */}
            <section className="bg-[#C6FF00] py-16 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto text-center"
                >
                    <h3 className="text-4xl md:text-5xl font-black text-[#0012FF] mb-8">
                        JOIN OUR COMMUNITY
                    </h3>
                    <div className="flex justify-center items-center gap-8">
                        <motion.a
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            href="#"
                            className="w-16 h-16 md:w-20 md:h-20 bg-[#0012FF] rounded-2xl flex items-center justify-center hover:shadow-lg transition-shadow"
                        >
                            <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="#C6FF00" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            href="#"
                            className="w-16 h-16 md:w-20 md:h-20 bg-[#0012FF] rounded-2xl flex items-center justify-center hover:shadow-lg transition-shadow"
                        >
                            <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="#C6FF00" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </motion.a>
                        <motion.a
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            href="#"
                            className="w-16 h-16 md:w-20 md:h-20 bg-[#0012FF] rounded-2xl flex items-center justify-center hover:shadow-lg transition-shadow"
                        >
                            <svg className="w-10 h-10 md:w-12 md:h-12" fill="#C6FF00" viewBox="0 0 24 24">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                        </motion.a>
                    </div>
                </motion.div>
            </section>

            {/* Copyright Footer */}
            <div className="bg-[#C6FF00] pb-4 text-center">
                <p className="text-[#0012FF]/70 text-xs font-medium tracking-wide">
                    &copy; COPYRIGHT MKAVS GLOBAL TECH/ SUPPORT@MKAVS.COM
                </p>
            </div>
        </div>
    );
}

// Floating Shapes Component
function FloatingShapes() {
    const shapes = [
        { delay: 0, duration: 3, x: "10%", y: "15%" },
        { delay: 0.5, duration: 4, x: "85%", y: "25%" },
        { delay: 1, duration: 3.5, x: "15%", y: "65%" },
        { delay: 1.5, duration: 4.5, x: "75%", y: "75%" },
        { delay: 0.8, duration: 3.8, x: "50%", y: "45%" },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute w-12 h-12 md:w-16 md:h-16"
                    style={{ left: shape.x, top: shape.y }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: shape.duration,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="8" fill="#C6FF00" />
                        <path
                            d="M50 20 L65 45 L90 50 L65 55 L50 80 L35 55 L10 50 L35 45 Z"
                            fill="none"
                            stroke="#C6FF00"
                            strokeWidth="2"
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
