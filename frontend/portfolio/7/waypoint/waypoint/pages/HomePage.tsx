import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Page, Hotspot } from '../types';
import { destinations } from '../constants/destinations';
import { mockJournalPosts, mockReviews } from '../constants/mockData';
import StarRating from '../components/StarRating';
import ImgFallback from '../components/ImgFallback';
import ScrollReveal from '../components/ScrollReveal';

interface HomePageProps {
    setPage: (page: Page) => void;
    onSelectHotspot: (hotspotName: string) => void;
    isHeaderPresent?: boolean;
    revealText?: boolean;
}

const topDestinations = destinations
    .flatMap(c => c.categories.flatMap(cat => cat.hotspots))
    .slice(0, 6);

export default function HomePage({ setPage, onSelectHotspot, isHeaderPresent = true, revealText = true }: HomePageProps) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState<Hotspot[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const allHotspots = useMemo(() => destinations.flatMap(c => c.categories.flatMap(cat => cat.hotspots)), []);

    useEffect(() => {
        const storyInterval = setInterval(() => {
            setCurrentStoryIndex(prev => (prev + 1) % mockJournalPosts.length);
        }, 5000);
        return () => clearInterval(storyInterval);
    }, []);

    useEffect(() => {
        const reviewInterval = setInterval(() => {
            setCurrentReviewIndex(prev => (prev + 1) % mockReviews.length);
        }, 7000);
        return () => clearInterval(reviewInterval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 1) {
            const filtered = allHotspots.filter(hotspot =>
                hotspot.name.toLowerCase().includes(value.toLowerCase()) ||
                hotspot.city.toLowerCase().includes(value.toLowerCase()) ||
                hotspot.country.toLowerCase().includes(value.toLowerCase())
            );
            setSearchSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (hotspotName: string) => {
        onSelectHotspot(hotspotName);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const currentStory = mockJournalPosts[currentStoryIndex];
    const currentReview = mockReviews[currentReviewIndex];

    return (
        <div className="pb-16">
            {/* Hero Section */}
            <section className={`h-screen ${isHeaderPresent ? '-mt-20' : ''} flex flex-col items-center justify-center relative text-white text-center px-4 overflow-hidden`}>
                <ImgFallback
                    src="https://manvsclock.com/wp-content/uploads/Christ-the-Redeemer-Brazil.jpeg"
                    alt="hero"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${!isHeaderPresent ? 'scale-150' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Bottom Gradient Fade for Seamless Transition */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-waypoint-darkest to-transparent"></div>

                <div className={`relative z-10 flex flex-col items-center transition-all duration-[1000ms] ${revealText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                        Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary drop-shadow-[0_0_15px_rgba(229,180,226,0.3)] animate-pulse-glow">Hidden Wonders</span>
                    </h1>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mt-2">of the World</h2>
                    <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-light tracking-wide leading-relaxed">Your journey begins here. Explore, dream, and discover with <span className="text-white font-bold">WAYPOINT.</span></p>

                    <div className="mt-12 w-full max-w-2xl mx-auto" ref={searchRef}>
                        <div className="relative group/search">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                                placeholder="e.g., Eiffel Tower, Paris, or France"
                                className="w-full pl-8 pr-16 py-5 text-lg text-white bg-white/10 border-2 border-white/10 rounded-full focus:ring-4 focus:ring-waypoint-primary/30 focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-500 placeholder-gray-400 backdrop-blur-md shadow-2xl"
                            />
                            <button className="absolute inset-y-0 right-0 flex items-center justify-center w-16 text-white/50 hover:text-white transition-colors">
                                <i className="fas fa-search text-xl"></i>
                            </button>
                            <div className={`absolute z-20 w-full mt-4 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-80 overflow-y-auto text-left transform origin-top transition-all duration-300 ease-out ${showSuggestions && searchSuggestions.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {searchSuggestions.map(hotspot => (
                                    <button
                                        key={hotspot.name}
                                        onClick={() => handleSuggestionClick(hotspot.name)}
                                        className="w-full text-left px-6 py-4 text-white hover:bg-white/10 transition-colors flex items-center space-x-4 border-b border-white/5 last:border-0"
                                    >
                                        <img src={hotspot.image} alt={hotspot.name} className="w-12 h-12 object-cover rounded-xl" />
                                        <div>
                                            <p className="font-bold text-lg">{hotspot.name}</p>
                                            <p className="text-sm text-gray-400 font-medium">{hotspot.city}, {hotspot.country}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setPage('explore')}
                        className="mt-12 group relative px-10 py-4 bg-white text-waypoint-darkest font-black rounded-full text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-95"
                    >
                        <span className="relative z-10 uppercase tracking-widest">Or Browse All Destinations</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-waypoint-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                </div>
            </section>

            {/* Top Destinations Section */}
            < section className="relative py-32 md:py-48" >
                <ImgFallback src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" alt="map-bg" className="absolute inset-0 w-full h-full object-cover bg-fixed" />
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Top and Bottom Gradient Fades for Seamless Transition */}
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-waypoint-darkest to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-waypoint-darkest to-transparent"></div>

                <div className="relative z-10 container mx-auto px-6">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-waypoint-accent font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 block animate-fade-in">Discover Our Curated</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary">Destinations</span>
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary mx-auto mt-6 rounded-full"></div>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {topDestinations.map((dest, idx) => (
                            <ScrollReveal key={dest.name} delay={idx * 100}>
                                <div
                                    className="relative rounded-2xl overflow-hidden h-96 group cursor-pointer shadow-xl transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-waypoint-primary/30 bg-waypoint-dark"
                                    onClick={() => onSelectHotspot(dest.name)}
                                >
                                    <ImgFallback src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-waypoint-darkest via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                            Explore
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center space-x-2 text-waypoint-accent mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                            <i className="fas fa-map-marker-alt text-xs"></i>
                                            <span className="text-xs font-bold uppercase tracking-widest">{dest.country}</span>
                                        </div>
                                        <h3 className="text-3xl font-extrabold text-white mb-1 group-hover:text-waypoint-accent transition-colors duration-300">{dest.name}</h3>
                                        <div className="w-0 group-hover:w-full h-0.5 bg-waypoint-accent transition-all duration-500 delay-200"></div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section >

            {/* Latest Stories Section */}
            < section className="container mx-auto px-6 py-24 md:py-32 overflow-hidden relative" >
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="text-waypoint-accent font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 block">From Our Community</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary">Stories</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary mx-auto mt-6 rounded-full"></div>
                    </div>
                </ScrollReveal>
                <ScrollReveal direction="left">
                    <div className="relative w-full h-[450px] md:h-[400px] max-w-4xl mx-auto">
                        {mockJournalPosts.map((story, index) => (
                            <div key={story.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentStoryIndex ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex flex-col md:flex-row bg-white/[0.03] rounded-3xl overflow-hidden h-full shadow-2xl border border-white/10 backdrop-blur-xl group cursor-default">
                                    <div className="w-full md:w-1/2 h-56 md:h-full overflow-hidden">
                                        <ImgFallback src={story.image} alt={story.title} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white/[0.05] to-transparent">
                                        <div className="flex items-center space-x-2 text-waypoint-accent mb-4">
                                            <i className="fas fa-journal-whills text-sm"></i>
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">{story.location}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-white leading-tight">{story.title}</h3>
                                        <p className="text-gray-400 mb-8 text-base md:text-lg leading-relaxed flex-grow italic font-light font-serif">
                                            "{story.content.substring(0, 150)}..."
                                        </p>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-waypoint-accent to-waypoint-primary flex items-center justify-center text-white font-bold">
                                                    {story.author[0]}
                                                </div>
                                                <span className="text-white font-medium">{story.author}</span>
                                            </div>
                                            <StarRating rating={story.rating} size="sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </section >

            {/* Highlights Section */}
            < section className="container mx-auto px-6 py-24 md:py-48" >
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="text-waypoint-accent font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 block">Explorer Feedback</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary">Highlights</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary mx-auto mt-6 rounded-full"></div>
                    </div>
                </ScrollReveal>
                <ScrollReveal direction="right">
                    <div className="relative max-w-4xl mx-auto bg-white/[0.03] p-12 md:p-20 rounded-[3rem] shadow-2xl backdrop-blur-3xl border border-white/10 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-waypoint-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-waypoint-accent/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <i className="fas fa-quote-left text-9xl text-white/[0.03] absolute -top-8 -left-8"></i>
                        <div className="transition-opacity duration-700 relative z-10">
                            <p className="text-xl md:text-3xl text-center italic mb-10 leading-relaxed font-light">"{currentReview.review}"</p>
                            <div className="text-center">
                                <p className="font-bold text-white text-xl md:text-2xl mb-1">{currentReview.author}</p>
                                <p className="text-gray-400 text-sm md:text-base tracking-widest uppercase mb-6">{currentReview.location}</p>
                                <div className="flex justify-center">
                                    <StarRating rating={currentReview.rating} size="lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section >
        </div >
    );
}
