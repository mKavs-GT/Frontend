import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import { mockMoviesDatabase } from '../services/mockData';
import '../styles/Search.css';

const Search = ({ initialCategory = 'All' }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // Transform mock database into array format suitable for MovieCard
    const allContent = useMemo(() => {
        return Object.entries(mockMoviesDatabase).map(([key, entry]) => {
            const m = entry.result;
            // Determine content type/category roughly
            let category = 'Movie';
            if (m.Type === 'series') category = 'TV Shows';
            if (m.Genre && m.Genre.includes('Animation')) category = 'Anime';

            return {
                id: m.imdbID || key,
                title: m.Title,
                image: m.Poster,
                rating: m.imdbRating ? `IMDb ${m.imdbRating}` : '',
                ageRating: m.Rated,
                duration: m.Runtime,
                year: m.Year,
                genres: m.Genre ? m.Genre.split(', ').map(g => g.trim()) : [],
                category: category,
                originalType: m.Type, // 'movie' or 'series'
                description: m.Plot,
                languages: m.Language
            };
        });
    }, []);

    // Update search term when URL query parameter changes
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    // Extract unique genres for filter usage if needed, or stick to a curated list
    const categories = ['All', 'Movies', 'TV Shows', 'Anime', 'Action', 'Sci-Fi', 'Fantasy', 'Comedy', 'Drama', 'Horror', 'Romance'];

    const filteredContent = allContent.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.genres && item.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())));

        let matchesCategory = true;
        if (activeCategory !== 'All') {
            if (activeCategory === 'Movies') {
                matchesCategory = item.originalType === 'movie';
            } else if (activeCategory === 'TV Shows') {
                matchesCategory = item.originalType === 'series' && !item.genres.includes('Animation'); // Separate standard series from anime if desired, or just include all series
            } else if (activeCategory === 'Anime') {
                matchesCategory = item.genres.includes('Animation');
            } else {
                // Genre filtering
                matchesCategory = item.genres.includes(activeCategory);
            }
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="search-page container">
            <div className="search-header">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for movies, shows, genres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => {
                                if (cat === 'Movies') navigate('/movies');
                                else if (cat === 'TV Shows') navigate('/tv-shows');
                                else if (cat === 'Anime') navigate('/anime');
                                else setActiveCategory(cat);
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="search-results">
                <h3 className="results-count">Found {filteredContent.length} results</h3>
                <div className="content-grid">
                    {filteredContent.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
                {filteredContent.length === 0 && (
                    <div className="no-results">
                        <p>No matches found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
