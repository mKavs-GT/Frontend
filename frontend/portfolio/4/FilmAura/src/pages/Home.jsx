import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';
import avatarPoster from '../assets/avatar-wow.jpg';
import wizardPoster from '../assets/wizard-of-oz.jpg';
import lotrPoster from '../assets/lotr-return-king.jpg';
import endgamePoster from '../assets/avengers-endgame.jpg';

const Home = () => {
    const { continueWatching } = useAuth();

    // Dummy Data for demonstration (In a real app, filters would update this data)
    const movies = {
        trending: [
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
        ],
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
        ],
        anime: [
            {
                id: "tt0388629",
                title: "One Piece",
                image: "https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_QL75_UY562_CR15,0,380,562_.jpg",
                match: "98% Match",
                imdbRating: "IMDb 8.9",
                year: "1999",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Monkey D. Luffy and his pirate crew explore the Grand Line in search of the ultimate treasure, the One Piece."
            },
            {
                id: "tt0409591",
                title: "Naruto",
                image: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.4",
                year: "2002",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Naruto Uzumaki, a teenage ninja, struggles for recognition and dreams of becoming the Hokage, the village's leader."
            },
            {
                id: "tt0176385",
                title: "Pokémon",
                image: "https://m.media-amazon.com/images/M/MV5BMzE0ZDU1MzQtNTNlYS00YjNlLWE2ODktZmFmNDYzMTBlZTBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "95% Match",
                imdbRating: "IMDb 7.5",
                year: "1997",
                duration: "TV Series",
                ageRating: "U",
                languages: "Japanese, English",
                description: "Ash Ketchum and his partner Pikachu travel across many regions, battling gym leaders and entering tournaments to become a Pokemon Master."
            },
            {
                id: "tt0214341",
                title: "Dragon Ball Z",
                image: "https://m.media-amazon.com/images/M/MV5BNmFiM2FkYTYtY2FiOS00ZWJkLTkyOTgtNmFmODI4NjcwNDgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "98% Match",
                imdbRating: "IMDb 8.8",
                year: "1989",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Goku and his friends defend the Earth against an assortment of villains ranging from intergalactic space fighters to powerful androids."
            },
            {
                id: "tt9335498",
                title: "Demon Slayer: Kimetsu no Yaiba",
                image: "https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "99% Match",
                imdbRating: "IMDb 8.6",
                year: "2019",
                duration: "TV Series",
                ageRating: "A",
                languages: "Japanese, English",
                description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly."
            },
            {
                id: "tt2560140",
                title: "Attack on Titan",
                image: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "99% Match",
                imdbRating: "IMDb 9.1",
                year: "2013",
                duration: "TV Series",
                ageRating: "A",
                languages: "Japanese, English",
                description: "After his hometown is destroyed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction."
            },
            {
                id: "tt13706018",
                title: "Spy x Family",
                image: "https://m.media-amazon.com/images/M/MV5BZDkwNjc0NWEtNzJlOC00N2YwLTk4MjktZGFlZDE2Y2QzOWI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "96% Match",
                imdbRating: "IMDb 8.3",
                year: "2022",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own."
            },
            {
                id: "tt6342474",
                title: "Boruto: Naruto Next Generations",
                image: "https://m.media-amazon.com/images/M/MV5BNDgzYzNhOGUtMWI1Mi00YjJkLWI2NGItOWFlNDE4ZjE0NGExXkEyXkFqcGc@._V1_.jpg",
                match: "85% Match",
                imdbRating: "IMDb 6.6",
                year: "2017",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Son of Naruto Uzumaki, Boruto, faces the challenges of living under his father's shadow and a new threat to the ninja world."
            },
            {
                id: "tt0877057",
                title: "Death Note",
                image: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "99% Match",
                imdbRating: "IMDb 8.9",
                year: "2006",
                duration: "TV Series",
                ageRating: "UA 16+",
                languages: "Japanese, English",
                description: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone."
            },
            {
                id: "tt0434665",
                title: "Bleach",
                image: "https://m.media-amazon.com/images/M/MV5BOWQwOWY5NTUtMjAyZi00YjQzLTkwODgtNmQwZjU1MGIzZDhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "94% Match",
                imdbRating: "IMDb 8.2",
                year: "2004",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Ichigo Kurosaki, a teenager with the ability to see ghosts, gains the powers of a Soul Reaper and sets out to save the world from 'Hollows'."
            },
            {
                id: "tt1535491",
                title: "Fullmetal Alchemist: Brotherhood",
                image: "https://m.media-amazon.com/images/M/MV5BMzNiODA5NjYtYWExZS00OTc4LTg3N2ItYWYwYTUyYmM5MWViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "99% Match",
                imdbRating: "IMDb 9.1",
                year: "2009",
                duration: "TV Series",
                ageRating: "UA 16+",
                languages: "Japanese, English",
                description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms."
            },
            {
                id: "tt2098220",
                title: "Hunter x Hunter",
                image: "https://m.media-amazon.com/images/M/MV5BYzYxOTlkYzctNGY2MC00MjNjLWIxOWMtY2QwYjcxZWIwMmEwXkEyXkFqcGc@._V1_.jpg",
                match: "98% Match",
                imdbRating: "IMDb 9.0",
                year: "2011",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Gon Freecss aspires to become a Hunter and seeks out his father, who left him when he was younger."
            },
            {
                id: "tt12343534",
                title: "Jujutsu Kaisen",
                image: "https://m.media-amazon.com/images/M/MV5BMjBlNTExMDAtMWZjZi00MDc5LWFkMjgtZDU0ZWQ5ODk3YWY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.5",
                year: "2020",
                duration: "TV Series",
                ageRating: "A",
                languages: "Japanese, English",
                description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to exorcise himself."
            },
            {
                id: "tt21209876",
                title: "Solo Leveling",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjjydKUpH1rz3V2N2oTcKX7O3QIMkH_-xqqw&s",
                match: "96% Match",
                imdbRating: "IMDb 8.4",
                year: "2024",
                duration: "TV Series",
                ageRating: "UA 16+",
                languages: "Japanese, Korean, English",
                description: "In a world where hunters battle deadly monsters, a weak E-rank hunter gains the unique ability to level up in strength, becoming extraordinarily powerful."
            },
            {
                id: "tt0103524",
                title: "Sailor Moon",
                image: "https://m.media-amazon.com/images/M/MV5BNDBhMGE3ZjAtM2VlYi00ZDVhLThiNDgtNTIxNzY5NjJmYWUyXkEyXkFqcGc@._V1_.jpg",
                match: "93% Match",
                imdbRating: "IMDb 7.7",
                year: "1992",
                duration: "TV Series",
                ageRating: "U",
                languages: "Japanese, English",
                description: "Usagi Tsukino is a clumsy but kindhearted teenager who transforms into the powerful guardian of love and justice, Sailor Moon."
            },
            {
                id: "tt5626028",
                title: "My Hero Academia",
                image: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
                match: "95% Match",
                imdbRating: "IMDb 8.3",
                year: "2016",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero."
            },
            {
                id: "tt2250192",
                title: "Sword Art Online",
                image: "https://m.media-amazon.com/images/M/MV5BN2NhYzU2NDEtYzI1NS00MjgzLThjZGUtOTYxNGJkZjZmNDdjXkEyXkFqcGc@._V1_.jpg",
                match: "92% Match",
                imdbRating: "IMDb 7.5",
                year: "2012",
                duration: "TV Series",
                ageRating: "UA 13+",
                languages: "Japanese, English",
                description: "Players of a virtual reality MMORPG get trapped inside the game, where dying in the game means dying in the real world."
            },
            {
                id: "tt4508902",
                title: "One-Punch Man",
                image: "https://m.media-amazon.com/images/M/MV5BNzMwOGQ5MWItNzE3My00ZDYyLTk4NzAtZWIyYWI0NTZhYzY0XkEyXkFqcGc@._V1_.jpg",
                match: "97% Match",
                imdbRating: "IMDb 8.7",
                year: "2015",
                duration: "TV Series",
                ageRating: "UA 16+",
                languages: "Japanese, English",
                description: "The story of Saitama, a hero that does it just for fun & can defeat his enemies with a single punch."
            }
        ],
    };

    return (
        <div className="home-page">
            <Hero />

            <motion.div
                className="container content-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >

                {/* Continue Watching Section - Shows after content is watched */}
                {continueWatching && continueWatching.length > 0 && (
                    <ContentRow title="Continue Watching" data={continueWatching} showProgress={true} />
                )}

                <ContentRow title="Most Viewed" data={movies.trending} />
                <ContentRow title="Popular TV Series" data={movies.popular} />
                <ContentRow title="Most Viewed / Popular Anime Series" data={movies.anime} />
            </motion.div>
        </div>
    );
};


export default Home;
