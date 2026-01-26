import React from 'react';
import MovieCard from '../components/MovieCard';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/Home.css';

const TVShows = () => {

    // All TV shows from the Home page
    const tvShows = {
        popular: [
            {
                id: "tt0944947",
                title: "Game of Thrones",
                image: "https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
                match: "99% Match",
                imdbRating: "IMDb 9.2",
                year: "2011",
                duration: "8 Seasons",
                ageRating: "A",
                languages: "English",
                description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
            },
            {
                id: "tt0903747",
                title: "Breaking Bad",
                image: "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
                match: "99% Match",
                imdbRating: "IMDb 9.5",
                year: "2008",
                duration: "5 Seasons",
                ageRating: "A",
                languages: "English",
                description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future."
            },
            {
                id: "tt4574334",
                title: "Stranger Things",
                image: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
                match: "98% Match",
                imdbRating: "IMDb 8.7",
                year: "2016",
                duration: "4 Seasons",
                ageRating: "UA 16+",
                languages: "English",
                description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back."
            },
            {
                id: "tt1520211",
                title: "The Walking Dead",
                image: "https://image.tmdb.org/t/p/original/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg",
                match: "95% Match",
                imdbRating: "IMDb 8.1",
                year: "2010",
                duration: "11 Seasons",
                ageRating: "A",
                languages: "English",
                description: "Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors to stay alive."
            },
            {
                id: "tt0108778",
                title: "Friends",
                image: "https://image.tmdb.org/t/p/original/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
                match: "96% Match",
                imdbRating: "IMDb 8.9",
                year: "1994",
                duration: "10 Seasons",
                ageRating: "UA 13+",
                languages: "English",
                description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan."
            },
            {
                id: "tt10919420",
                title: "Squid Game",
                image: "https://image.tmdb.org/t/p/original/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.0",
                year: "2021",
                duration: "1 Season",
                ageRating: "A",
                languages: "Korean, English",
                description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes."
            },
            {
                id: "tt_pluribus",
                title: "Pluribus",
                image: "https://www.themoviedb.org/t/p/w1280/nrM2xFUfKJJEmZzd5d7kohT2G0C.jpg",
                match: "92% Match",
                imdbRating: "IMDb 8.5",
                year: "2025",
                duration: "1 Season",
                ageRating: "UA 16+",
                languages: "English",
                description: "A near-future thriller where humanity interacts with an advanced AI system named Pluribus."
            },
            {
                id: "tt_heated",
                title: "Heated Rivalry",
                image: "https://www.themoviedb.org/t/p/w1280/epgr7n61vVIniyAghz2GYj22DkC.jpg",
                match: "94% Match",
                imdbRating: "IMDb 8.8",
                year: "2025",
                duration: "1 Season",
                ageRating: "A",
                languages: "English",
                description: "Two rival hockey players find themselves in a heated romance that threatens their careers."
            },
            {
                id: "tt12637874",
                title: "Fallout",
                image: "https://media.themoviedb.org/t/p/original/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg",
                match: "96% Match",
                imdbRating: "IMDb 8.4",
                year: "2024",
                duration: "1 Season",
                ageRating: "A",
                languages: "English",
                description: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves."
            },
            {
                id: "tt22061614",
                title: "IT: Welcome to Derry",
                image: "https://www.themoviedb.org/t/p/w1280/nyy3BITeIjviv6PFIXtqvc8i6xi.jpg",
                match: "93% Match",
                imdbRating: "IMDb 8.2",
                year: "2025",
                duration: "1 Season",
                ageRating: "A",
                languages: "English",
                description: "Set in the world of Stephen King's IT universe, Welcome to Derry is based on King's It novel and expands the vision."
            },
            {
                id: "tt_landman",
                title: "Landman",
                image: "https://www.themoviedb.org/t/p/w1280/hYthRgS1nvQkGILn9YmqsF8kSk6.jpg",
                match: "89% Match",
                imdbRating: "IMDb 7.8",
                year: "2024",
                duration: "1 Season",
                ageRating: "A",
                languages: "English",
                description: "Set in the proverbial boomtowns of West Texas, Landman is a modern-day tale of fortune-seeking in the world of oil rigs."
            },
            {
                id: "tt11280740",
                title: "Severance",
                image: "https://media.themoviedb.org/t/p/original/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.7",
                year: "2022",
                duration: "1 Season",
                ageRating: "UA 16+",
                languages: "English",
                description: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives."
            },
            {
                id: "tt2802850",
                title: "Fargo",
                image: "https://www.themoviedb.org/t/p/w1280/6U9CPeD8obHzweikFhiLhpc7YBT.jpg",
                match: "95% Match",
                imdbRating: "IMDb 8.9",
                year: "2014",
                duration: "5 Seasons",
                ageRating: "A",
                languages: "English",
                description: "Various chronicles of deception, intrigue and murder in and around frozen Minnesota."
            },
            {
                id: "tt0413573",
                title: "Grey's Anatomy",
                image: "https://www.themoviedb.org/t/p/w1280/hjJkrLXhWvGHpLeLBDFznpBTY1S.jpg",
                match: "91% Match",
                imdbRating: "IMDb 7.6",
                year: "2005",
                duration: "19 Seasons",
                ageRating: "UA 16+",
                languages: "English",
                description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors."
            },
            {
                id: "tt2372162",
                title: "Orange Is the New Black",
                image: "https://www.themoviedb.org/t/p/w1280/ekaa7YjGPTkFLcPhwWXTnARuCEU.jpg",
                match: "93% Match",
                imdbRating: "IMDb 8.0",
                year: "2013",
                duration: "7 Seasons",
                ageRating: "A",
                languages: "English",
                description: "Convicted of a decade old crime of transporting drug money to an ex-girlfriend, normally law-abiding Piper Chapman is sentenced to a year and a half behind bars."
            },
            {
                id: "tt5421782",
                title: "Riverdale",
                image: "https://www.themoviedb.org/t/p/w1280/d8mmn9thQ5dBk2qbv6BCqGUXWK3.jpg",
                match: "85% Match",
                imdbRating: "IMDb 6.5",
                year: "2017",
                duration: "7 Seasons",
                ageRating: "UA 13+",
                languages: "English",
                description: "While navigating the troubled waters of romance, school and family, Archie and his gang become entangled in dark Riverdale mysteries."
            },
            {
                id: "tt0460649",
                title: "How I Met Your Mother",
                image: "https://www.themoviedb.org/t/p/w1280/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
                match: "94% Match",
                imdbRating: "IMDb 8.3",
                year: "2005",
                duration: "9 Seasons",
                ageRating: "UA 13+",
                languages: "English",
                description: "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother."
            },
            {
                id: "tt2085059",
                title: "Black Mirror",
                image: "https://www.themoviedb.org/t/p/w1280/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
                match: "96% Match",
                imdbRating: "IMDb 8.8",
                year: "2011",
                duration: "6 Seasons",
                ageRating: "A",
                languages: "English",
                description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide."
            },
            {
                id: "tt8111088",
                title: "The Mandalorian",
                image: "https://media.themoviedb.org/t/p/original/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.7",
                year: "2019",
                duration: "3 Seasons",
                ageRating: "UA 13+",
                languages: "English",
                description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic."
            },
            {
                id: "tt2442560",
                title: "Peaky Blinders",
                image: "https://media.themoviedb.org/t/p/original/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
                match: "98% Match",
                imdbRating: "IMDb 8.8",
                year: "2013",
                duration: "6 Seasons",
                ageRating: "A",
                languages: "English",
                description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby."
            },
            {
                id: "tt1796960",
                title: "Homeland",
                image: "https://www.themoviedb.org/t/p/w1280/6GAvS2e6VIRsms9FpVt33PsCoEW.jpg",
                match: "90% Match",
                imdbRating: "IMDb 8.3",
                year: "2011",
                duration: "8 Seasons",
                ageRating: "A",
                languages: "English",
                description: "A bipolar CIA operative becomes convinced a prisoner of war has been turned by al-Qaeda and is planning to carry out a terrorist attack on American soil."
            }
        ]
    };

    return (
        <div className="home">
            <div className="container" style={{ marginTop: '80px' }}>
                <ScrollReveal y={-20} duration={0.6}>
                    <h1 className="section-title">TV Shows</h1>
                </ScrollReveal>
                <div className="content-grid">
                    {tvShows.popular.map((item) => (
                        <MovieCard key={item.id} movie={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TVShows;
