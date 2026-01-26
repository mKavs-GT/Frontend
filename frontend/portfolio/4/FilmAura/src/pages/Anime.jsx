import React from 'react';
import MovieCard from '../components/MovieCard';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/Home.css';

const Anime = () => {
    const animeSeries = [
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
    ];

    return (
        <div className="home">
            <div className="container" style={{ marginTop: '80px' }}>
                <ScrollReveal y={-20} duration={0.6}>
                    <h1 className="section-title">Anime Series</h1>
                </ScrollReveal>
                <div className="content-grid">
                    {animeSeries.map((item) => (
                        <MovieCard key={item.id} movie={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Anime;
