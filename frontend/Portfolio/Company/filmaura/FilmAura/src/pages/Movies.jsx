import React from 'react';
import MovieCard from '../components/MovieCard';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/Home.css';
import avatarPoster from '../assets/avatar-wow.jpg';
import wizardPoster from '../assets/wizard-of-oz.jpg';
import lotrPoster from '../assets/lotr-return-king.jpg';
import endgamePoster from '../assets/avengers-endgame.jpg';

const Movies = () => {

    // All movies from the Home page
    const movies = {
        trending: [
            {
                id: "tt6443346",
                title: "Black Adam",
                image: "https://image.tmdb.org/t/p/original/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
                match: "98% Match",
                imdbRating: "IMDb 6.3",
                year: "2022",
                duration: "2h 5m",
                ageRating: "PG-13",
                languages: "English",
                description: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world."
            },
            {
                id: "tt1745960",
                title: "Top Gun: Maverick",
                image: "https://m.media-amazon.com/images/I/71BokibfVUL._SL1500_.jpg",
                match: "99% Match",
                imdbRating: "IMDb 8.3",
                year: "2022",
                duration: "2h 10m",
                ageRating: "PG-13",
                languages: "English",
                description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it."
            },
            {
                id: "tt0120338",
                title: "Titanic",
                image: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                match: "98% Match",
                imdbRating: "IMDb 7.9",
                year: "1997",
                duration: "3h 14m",
                ageRating: "UA 13+",
                languages: "English, French",
                description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic."
            },
            {
                id: "tt0083866",
                title: "E.T. the Extra-Terrestrial",
                image: "https://image.tmdb.org/t/p/original/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg",
                match: "95% Match",
                imdbRating: "IMDb 7.9",
                year: "1982",
                duration: "1h 55m",
                ageRating: "U",
                languages: "English",
                description: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world."
            },
            {
                id: "tt0032138",
                title: "The Wizard of Oz",
                image: wizardPoster,
                match: "94% Match",
                imdbRating: "IMDb 8.1",
                year: "1939",
                duration: "1h 42m",
                ageRating: "U",
                languages: "English",
                description: "Dorothy Gale is swept away from a farm in Kansas to a magical land of Oz in a tornado and embarks on a quest with her new friends."
            },
            {
                id: "tt0076759",
                title: "Star Wars: A New Hope",
                image: "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.6",
                year: "1977",
                duration: "2h 1m",
                ageRating: "UA",
                languages: "English",
                description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station."
            },
            {
                id: "tt0167260",
                title: "The Lord of the Rings: The Return of the King",
                image: lotrPoster,
                match: "99% Match",
                imdbRating: "IMDb 9.0",
                year: "2003",
                duration: "3h 21m",
                ageRating: "UA 13+",
                languages: "English, Elvish",
                description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring."
            },
            {
                id: "tt0499549",
                title: "Avatar",
                image: "https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
                match: "95% Match",
                imdbRating: "IMDb 7.9",
                year: "2009",
                duration: "2h 42m",
                ageRating: "UA 13+",
                languages: "English, Na'vi",
                description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home."
            },
            {
                id: "tt4154796",
                title: "Avengers: Endgame",
                image: endgamePoster,
                match: "99% Match",
                imdbRating: "IMDb 8.4",
                year: "2019",
                duration: "3h 1m",
                ageRating: "UA 13+",
                languages: "English, Hindi",
                description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions."
            },
            {
                id: "tt1630029",
                title: "Avatar: The Way of Water",
                image: avatarPoster,
                match: "96% Match",
                imdbRating: "IMDb 7.6",
                year: "2022",
                duration: "3h 12m",
                ageRating: "UA 13+",
                languages: "English, Na'vi",
                description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home."
            }
        ]
    };

    return (
        <div className="home">
            <div className="container" style={{ marginTop: '80px' }}>
                <ScrollReveal y={-20} duration={0.6}>
                    <h1 className="section-title">Movies</h1>
                </ScrollReveal>
                <div className="content-grid">
                    {movies.trending.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Movies;
