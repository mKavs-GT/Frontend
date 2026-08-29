// Mock IMDb Data for Development
// This provides realistic data without API calls

export const mockMoviesDatabase = {
    // Titanic
    'tt0120338': {
        success: true,
        result: {
            Title: "Titanic",
            Year: "1997",
            Rated: "PG-13",
            Released: "19 Dec 1997",
            Runtime: "194 min",
            Genre: "Drama, Romance",
            Director: "James Cameron",
            Writer: "James Cameron",
            Actors: "Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates",
            Plot: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
            Language: "English, Swedish, Italian, French",
            Country: "United States, Mexico",
            Awards: "Won 11 Oscars. 126 wins & 83 nominations total",
            Poster: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.9/10" },
                { Source: "Rotten Tomatoes", Value: "88%" },
                { Source: "Metacritic", Value: "75/100" }
            ],
            Metascore: "75",
            imdbRating: "7.9",
            imdbVotes: "1,234,567",
            imdbID: "tt0120338",
            Type: "movie",
            BoxOffice: "$659,363,944",
            Production: "20th Century Fox, Paramount Pictures"
        }
    },

    // E.T.
    'tt0083866': {
        success: true,
        result: {
            Title: "E.T. the Extra-Terrestrial",
            Year: "1982",
            Rated: "PG",
            Released: "11 Jun 1982",
            Runtime: "115 min",
            Genre: "Family, Sci-Fi",
            Director: "Steven Spielberg",
            Writer: "Melissa Mathison",
            Actors: "Henry Thomas, Drew Barrymore, Peter Coyote, Dee Wallace",
            Plot: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.",
            Language: "English",
            Country: "United States",
            Awards: "Won 4 Oscars. 54 wins & 30 nominations total",
            Poster: "https://image.tmdb.org/t/p/original/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.9/10" },
                { Source: "Rotten Tomatoes", Value: "99%" },
                { Source: "Metacritic", Value: "91/100" }
            ],
            Metascore: "91",
            imdbRating: "7.9",
            imdbVotes: "432,109",
            imdbID: "tt0083866",
            Type: "movie",
            BoxOffice: "$435,110,554",
            Production: "Universal Pictures"
        }
    },

    // The Wizard of Oz
    'tt0032138': {
        success: true,
        result: {
            Title: "The Wizard of Oz",
            Year: "1939",
            Rated: "G",
            Released: "25 Aug 1939",
            Runtime: "102 min",
            Genre: "Adventure, Family, Fantasy",
            Director: "Victor Fleming",
            Writer: "Noel Langley, Florence Ryerson, Edgar Allan Woolf",
            Actors: "Judy Garland, Frank Morgan, Ray Bolger, Bert Lahr",
            Plot: "Dorothy Gale is swept away from a farm in Kansas to a magical land of Oz in a tornado and embarks on a quest with her new friends to see the Wizard who can help her return home.",
            Language: "English",
            Country: "United States",
            Awards: "Won 2 Oscars. 13 wins & 14 nominations total",
            Poster: "/images/wizard-of-oz.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.1/10" },
                { Source: "Rotten Tomatoes", Value: "98%" },
                { Source: "Metacritic", Value: "92/100" }
            ],
            Metascore: "92",
            imdbRating: "8.1",
            imdbVotes: "421,876",
            imdbID: "tt0032138",
            Type: "movie",
            BoxOffice: "$24,668,669",
            Production: "Metro-Goldwyn-Mayer"
        }
    },

    // Star Wars
    'tt0076759': {
        success: true,
        result: {
            Title: "Star Wars: Episode IV - A New Hope",
            Year: "1977",
            Rated: "PG",
            Released: "25 May 1977",
            Runtime: "121 min",
            Genre: "Action, Adventure, Fantasy",
            Director: "George Lucas",
            Writer: "George Lucas",
            Actors: "Mark Hamill, Harrison Ford, Carrie Fisher, Alec Guinness",
            Plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
            Language: "English",
            Country: "United States",
            Awards: "Won 6 Oscars. 65 wins & 31 nominations total",
            Poster: "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.6/10" },
                { Source: "Rotten Tomatoes", Value: "93%" },
                { Source: "Metacritic", Value: "90/100" }
            ],
            Metascore: "90",
            imdbRating: "8.6",
            imdbVotes: "1,432,987",
            imdbID: "tt0076759",
            Type: "movie",
            BoxOffice: "$460,998,507",
            Production: "Lucasfilm, 20th Century Fox"
        }
    },

    // LOTR: Return of the King
    'tt0167260': {
        success: true,
        result: {
            Title: "The Lord of the Rings: The Return of the King",
            Year: "2003",
            Rated: "PG-13",
            Released: "17 Dec 2003",
            Runtime: "201 min",
            Genre: "Action, Adventure, Drama",
            Director: "Peter Jackson",
            Writer: "J.R.R. Tolkien, Fran Walsh, Philippa Boyens, Peter Jackson",
            Actors: "Elijah Wood, Viggo Mortensen, Ian McKellen, Orlando Bloom",
            Plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            Language: "English, Quenya, Old English, Sindarin",
            Country: "New Zealand, United States",
            Awards: "Won 11 Oscars. 129 wins & 126 nominations total",
            Poster: "/images/lotr-return-king.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "9.0/10" },
                { Source: "Rotten Tomatoes", Value: "94%" },
                { Source: "Metacritic", Value: "94/100" }
            ],
            Metascore: "94",
            imdbRating: "9.0",
            imdbVotes: "1,923,456",
            imdbID: "tt0167260",
            Type: "movie",
            BoxOffice: "$377,845,905",
            Production: "New Line Cinema, WingNut Films"
        }
    },

    // Avatar
    'tt0499549': {
        success: true,
        result: {
            Title: "Avatar",
            Year: "2009",
            Rated: "PG-13",
            Released: "18 Dec 2009",
            Runtime: "162 min",
            Genre: "Action, Adventure, Fantasy",
            Director: "James Cameron",
            Writer: "James Cameron",
            Actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang",
            Plot: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
            Language: "English, Spanish",
            Country: "United States, United Kingdom",
            Awards: "Won 3 Oscars. 89 wins & 131 nominations total",
            Poster: "https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.9/10" },
                { Source: "Rotten Tomatoes", Value: "81%" },
                { Source: "Metacritic", Value: "83/100" }
            ],
            Metascore: "83",
            imdbRating: "7.9",
            imdbVotes: "1,345,678",
            imdbID: "tt0499549",
            Type: "movie",
            BoxOffice: "$760,507,625",
            Production: "20th Century Fox, Lightstorm Entertainment"
        }
    },

    // Avengers: Endgame
    'tt4154796': {
        success: true,
        result: {
            Title: "Avengers: Endgame",
            Year: "2019",
            Rated: "PG-13",
            Released: "26 Apr 2019",
            Runtime: "181 min",
            Genre: "Action, Adventure, Drama",
            Director: "Anthony Russo, Joe Russo",
            Writer: "Christopher Markus, Stephen McFeely, Stan Lee",
            Actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth",
            Plot: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
            Language: "English, Japanese, Xhosa, German",
            Country: "United States",
            Awards: "Nominated for 1 Oscar. 70 wins & 132 nominations total",
            Poster: "/images/avengers-endgame.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.4/10" },
                { Source: "Rotten Tomatoes", Value: "94%" },
                { Source: "Metacritic", Value: "78/100" }
            ],
            Metascore: "78",
            imdbRating: "8.4",
            imdbVotes: "1,234,987",
            imdbID: "tt4154796",
            Type: "movie",
            BoxOffice: "$858,373,000",
            Production: "Marvel Studios, Walt Disney Pictures"
        }
    },

    // Avatar: The Way of Water
    'tt1630029': {
        success: true,
        result: {
            Title: "Avatar: The Way of Water",
            Year: "2022",
            Rated: "PG-13",
            Released: "16 Dec 2022",
            Runtime: "192 min",
            Genre: "Action, Adventure, Fantasy",
            Director: "James Cameron",
            Writer: "James Cameron, Rick Jaffa, Amanda Silver",
            Actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Kate Winslet",
            Plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
            Language: "English",
            Country: "United States",
            Awards: "Won 1 Oscar. 58 wins & 208 nominations total",
            Poster: "/images/avatar-wow.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.6/10" },
                { Source: "Rotten Tomatoes", Value: "76%" },
                { Source: "Metacritic", Value: "67/100" }
            ],
            Metascore: "67",
            imdbRating: "7.6",
            imdbVotes: "543,210",
            imdbID: "tt1630029",
            Type: "movie",
            BoxOffice: "$684,075,767",
            Production: "20th Century Studios, Lightstorm Entertainment"
        }
    },
    // Game of Thrones
    'tt0944947': {
        success: true,
        result: {
            Title: "Game of Thrones",
            Year: "2011",
            Rated: "TV-MA",
            Released: "17 Apr 2011",
            Runtime: "57 min",
            Genre: "Action, Adventure, Drama",
            Director: "N/A",
            Writer: "David Benioff, D.B. Weiss",
            Actors: "Emilia Clarke, Peter Dinklage, Kit Harington, Lena Headey",
            Plot: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
            Poster: "https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
            imdbRating: "9.2",
            imdbVotes: "2,200,000",
            imdbID: "tt0944947",
            Type: "series",
            totalSeasons: "8",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Winter Is Coming", plot: "Lord Eddard Stark is asked to become the Hand of the King.", rating: "9.1" },
                        { title: "The Kingsroad", plot: "The Starks travel to King's Landing. Jon Snow heads to the Wall.", rating: "8.7" },
                        { title: "Lord Snow", plot: "Jon begins his training at the Wall. Ned arrives at King's Landing.", rating: "8.6" },
                        { title: "Cripples, Bastards, and Broken Things", plot: "Ned investigates Arryn's death.", rating: "8.8" },
                        { title: "The Wolf and the Lion", plot: "Catelyn captures Tyrion Lannister.", rating: "9.0" },
                        { title: "A Golden Crown", plot: "Viserys demands his payment from Drogo.", rating: "9.2" },
                        { title: "You Win or You Die", plot: "Robert is injured while hunting.", rating: "9.2" },
                        { title: "The Pointy End", plot: "Arya begins her training with Syrio Forel.", rating: "9.0" },
                        { title: "Baelor", plot: "Robb goes to war. Ned makes a fateful decision.", rating: "9.6" },
                        { title: "Fire and Blood", plot: "Robb is declared King in the North. Daenerys pays a terrible price.", rating: "9.5" }
                    ]
                },
                {
                    seasonNumber: 2,
                    episodes: [
                        { title: "The North Remembers", plot: "Tyrion arrives at King's Landing to take Tywin's place as Hand. Stannis Baratheon plots to take the Iron Throne from his own claim.", rating: "8.8" },
                        { title: "The Night Lands", plot: "Arya makes friends with Gendry. Tyrion tries to take control of the Small Council. Theon arrives at Pyke.", rating: "8.5" },
                        { title: "What Is Dead May Never Die", plot: "Tyrion unmasks a spy. Catelyn meets Renly Baratheon. Bran dreams of a three-eyed raven.", rating: "8.8" },
                        { title: "Garden of Bones", plot: "Joffrey punishes Sansa for Robb's victories. Catelyn tries to unite Renly and Stannis.", rating: "8.8" },
                        { title: "The Ghost of Harrenhal", plot: "The Baratheon brothers rival claims divide their bannermen. Arya receives a promise from Jaqen H'ghar.", rating: "8.8" },
                        { title: "The Old Gods and the New", plot: "Theon seizes Winterfell. Joffrey faces a riot. Arya sends Jaqen to kill.", rating: "9.1" },
                        { title: "A Man Without Honor", plot: "Bran and Rickon escape Winterfell. Jon captures Ygritte.", rating: "8.9" },
                        { title: "The Prince of Winterfell", plot: "Stannis and Davos approach King's Landing. Tyrion plots defense.", rating: "8.8" },
                        { title: "Blackwater", plot: "Stannis launches a massive assault on King's Landing. Tyrion leads the defense with wildfire.", rating: "9.7" },
                        { title: "Valar Morghulis", plot: "Joffrey rewards his subjects. Arya receives a coin from Jaqen. Daenerys faces the warlocks.", rating: "9.4" }
                    ]
                },
                {
                    seasonNumber: 3,
                    episodes: [
                        { title: "Valar Dohaeris", plot: "Jon is brought before Mance Rayder. Tyrion demands his reward.", rating: "8.8" },
                        { title: "Dark Wings, Dark Words", plot: "Bran meets Jojen and Meera Reed. Arya encounters the Brotherhood Without Banners.", rating: "8.6" },
                        { title: "Walk of Punishment", plot: "Robb and Catelyn arrive at Riverrun. Jaime makes a deal.", rating: "8.9" },
                        { title: "And Now His Watch Is Ended", plot: "The Night's Watch survivors break apart. Daenerys trades for the Unsullied.", rating: "9.6" },
                        { title: "Kissed by Fire", plot: "The Hound is judged by the gods. Jon proves himself to the Wildlings.", rating: "9.0" },
                        { title: "The Climb", plot: "Tywin plans strategic unions for the Lannisters. The Wildlings scale the Wall.", rating: "8.8" },
                        { title: "The Bear and the Maiden Fair", plot: "Daenerys exchanges gifts with a slave lord. Brienne faces a formidable foe.", rating: "8.7" },
                        { title: "Second Sons", plot: "King's Landing hosts a wedding. Tyrion and Sansa spend the night together.", rating: "8.7" },
                        { title: "The Rains of Castamere", plot: "Robb presents himself to Walder Frey. Edmure meets his bride. Jon faces his hardest test.", rating: "9.9" },
                        { title: "Mhysa", plot: "Joffrey challenges Tywin. Bran tells a ghost story. Daenerys waits to see if she is a conqueror or a liberator.", rating: "9.1" }
                    ]
                },
                {
                    seasonNumber: 4,
                    episodes: [
                        { title: "Two Swords", plot: "Tyrion welcomes a guest. Jon warns the Night's Watch.", rating: "9.1" },
                        { title: "The Lion and the Rose", plot: "Joffrey and Margaery host a breakfast. The wedding begins.", rating: "9.7" },
                        { title: "Breaker of Chains", plot: "Tyrion ponders his options. Tywin extends an olive branch.", rating: "8.9" },
                        { title: "Oathkeeper", plot: "Daenerys balances justice and mercy. Jaime tasks Brienne with his honor.", rating: "8.8" },
                        { title: "First of His Name", plot: "Cersei and Tywin plot the next move. Jon embarks on a new mission.", rating: "8.7" },
                        { title: "The Laws of Gods and Men", plot: "Stannis and Davos set sail. Tyrion faces his father in the throne room.", rating: "9.7" },
                        { title: "Mockingbird", plot: "Tyrion enlists an unlikely ally. Daenerys entertains a suitor.", rating: "9.1" },
                        { title: "The Mountain and the Viper", plot: "Mole's Town is attacked. Sansa takes a stand. Oberyn Martell fights for Tyrion.", rating: "9.7" },
                        { title: "The Watchers on the Wall", plot: "The Night's Watch faces its biggest challenge as Mance Rayder's army attacks.", rating: "9.6" },
                        { title: "The Children", plot: "Circumstances change after an unexpected arrival north of the Wall.", rating: "9.7" }
                    ]
                },
                {
                    seasonNumber: 5,
                    episodes: [
                        { title: "The Wars to Come", plot: "Cersei and Jaime adjust to a world without Tywin. Varys reveals a conspiracy.", rating: "8.5" },
                        { title: "The House of Black and White", plot: "Arya arrives in Braavos. Pod and Brienne run into trouble.", rating: "8.5" },
                        { title: "High Sparrow", plot: "Margaery enjoys her new husband. Tyrion and Varys walk the Long Bridge.", rating: "8.5" },
                        { title: "Sons of the Harpy", plot: "The Faith Militant seize control. Jaime and Bronn land in Dorne.", rating: "8.7" },
                        { title: "Kill the Boy", plot: "Dany makes a difficult decision in Meereen. Jon enlists the help of an unexpected ally.", rating: "8.6" },
                        { title: "Unbowed, Unbent, Unbroken", plot: "Arya trains. Jorah and Tyrion run into slavers. Trystane and Myrcella make plans.", rating: "8.0" },
                        { title: "The Gift", plot: "Jon prepares for conflict. Sansa tries to talk to Theon. Brienne waits for a sign.", rating: "9.0" },
                        { title: "Hardhome", plot: "Jon travels to Hardhome to save the wildlings from the White Walkers.", rating: "9.9" },
                        { title: "The Dance of Dragons", plot: "Stannis makes a troubling decision. Daenerys oversees the opening of the fighting pits.", rating: "9.5" },
                        { title: "Mother's Mercy", plot: "Stannis marches. Dany is surrounded by strangers. Cersei seeks forgiveness.", rating: "9.1" }
                    ]
                },
                {
                    seasonNumber: 6,
                    episodes: [
                        { title: "The Red Woman", plot: "Jon Snow is dead. Daenerys meets a strong man. Cersei sees her daughter again.", rating: "8.5" },
                        { title: "Home", plot: "Bran trains with the Three-Eyed Raven. In King's Landing, Jaime advises Tommen.", rating: "9.4" },
                        { title: "Oathbreaker", plot: "Daenerys meets her future. Bran meets the past. Tommen confronts the High Sparrow.", rating: "8.7" },
                        { title: "Book of the Stranger", plot: "Tyrion strikes a deal. Jorah and Daario undertake a difficult task.", rating: "9.1" },
                        { title: "The Door", plot: "Tyrion seeks a strange ally. Bran learns a great deal. Brienne goes on a mission.", rating: "9.7" },
                        { title: "Blood of My Blood", plot: "An old foe comes back into the picture. Gilly meets Sam's family.", rating: "8.4" },
                        { title: "The Broken Man", plot: "The High Sparrow eyes another target. Jaime confronts a hero.", rating: "8.6" },
                        { title: "No One", plot: "While Jaime weighs his options, Cersei answers a request.", rating: "8.4" },
                        { title: "Battle of the Bastards", plot: "Terms of surrender are rejected and accepted. Jon Snow and Ramsay Bolton face off.", rating: "9.9" },
                        { title: "The Winds of Winter", plot: "Cersei and Loras Tyrell stand trial. Daenerys sets sail for Westeros.", rating: "9.9" }
                    ]
                },
                {
                    seasonNumber: 7,
                    episodes: [
                        { title: "Dragonstone", plot: "Jon organizes the defense of the North. Cersei tries to even the odds. Daenerys comes home.", rating: "8.6" },
                        { title: "Stormborn", plot: "Daenerys receives an unexpected visitor. Jon faces a revolt.", rating: "8.9" },
                        { title: "The Queen's Justice", plot: "Daenerys holds court. Cersei returns a gift. Jaime learns from his mistakes.", rating: "9.2" },
                        { title: "The Spoils of War", plot: "The Lannisters pay their debts. Daenerys weighs her options.", rating: "9.8" },
                        { title: "Eastwatch", plot: "Daenerys demands loyalty. Tyrion worries about her future plans.", rating: "8.8" },
                        { title: "Beyond the Wall", plot: "Jon and the Brotherhood hunt the dead. Arya confronts Sansa.", rating: "9.1" },
                        { title: "The Dragon and the Wolf", plot: "Everyone meets in King's Landing to discuss the fate of the realm.", rating: "9.4" }
                    ]
                },
                {
                    seasonNumber: 8,
                    episodes: [
                        { title: "Winterfell", plot: "Daenerys arrives at Winterfell. Jon and Daenerys learn the truth about their families.", rating: "7.6" },
                        { title: "A Knight of the Seven Kingdoms", plot: "Jaime faces judgment. Winterfell prepares for the Long Night.", rating: "7.9" },
                        { title: "The Long Night", plot: "The Night King and his army arrive at Winterfell for the final battle.", rating: "7.5" },
                        { title: "The Last of the Starks", plot: "The survivors plan their next steps. Cersei prepares King's Landing.", rating: "5.5" },
                        { title: "The Bells", plot: "Daenerys and Cersei face off as the battle for King's Landing begins.", rating: "6.0" },
                        { title: "The Iron Throne", plot: "In the aftermath of the devastation, the leaders of Westeros choose a new future.", rating: "4.0" }
                    ]
                }
            ]
        }
    },
    // Breaking Bad
    'tt0903747': {
        success: true,
        result: {
            Title: "Breaking Bad",
            Year: "2008",
            Rated: "TV-MA",
            Released: "20 Jan 2008",
            Runtime: "49 min",
            Genre: "Crime, Drama, Thriller",
            Director: "Vince Gilligan",
            Writer: "Vince Gilligan",
            Actors: "Bryan Cranston, Aaron Paul, Anna Gunn",
            Plot: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
            Poster: "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            imdbRating: "9.5",
            imdbVotes: "2,000,000",
            imdbID: "tt0903747",
            Type: "series",
            totalSeasons: "5",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Pilot", plot: "Diagnosed with terminal lung cancer, chemistry teacher Walter White teams up with former student Jesse Pinkman to cook and sell crystal meth.", rating: "9.0" },
                        { title: "Cat's in the Bag...", plot: "Walt and Jesse attempt to dispose of the two bodies in the RV.", rating: "8.7" },
                        { title: "...And the Bag's in the River", plot: "Walt wrestles with whether or not to kill Krazy-8.", rating: "8.8" },
                        { title: "Cancer Man", plot: "Walt tells his family about his cancer.", rating: "8.3" },
                        { title: "Gray Matter", plot: "Walt rejects an offer of financial help from an old friend.", rating: "8.4" },
                        { title: "Crazy Handful of Nothin'", plot: "Walt shaves his head and confronts Tuco.", rating: "9.3" },
                        { title: "A No-Rough-Stuff-Type Deal", plot: "Walt and Jesse try to make a deal with Tuco.", rating: "8.9" }
                    ]
                },
                {
                    seasonNumber: 2,
                    episodes: [
                        { title: "Seven Thirty-Seven", plot: "Walt and Jesse witness Tuco's volatility.", rating: "8.7" },
                        { title: "Grilled", plot: "Walt's disappearance is met with an investigation.", rating: "9.3" },
                        { title: "Bit by a Dead Bee", plot: "Walt and Jesse try to cover their tracks.", rating: "8.4" },
                        { title: "Down", plot: "Walt and Jesse try to reconnect.", rating: "8.2" },
                        { title: "Breakage", plot: "Walt and Jesse handle their new business expenses.", rating: "8.3" },
                        { title: "Peekaboo", plot: "Jesse tracks down the people who stole Skinny Pete's drugs.", rating: "8.8" },
                        { title: "Negro Y Azul", plot: "Rumors spread that Jesse crushed the addict's head with an ATM.", rating: "8.6" },
                        { title: "Better Call Saul", plot: "Badger gets caught by the DEA.", rating: "9.2" },
                        { title: "4 Days Out", plot: "Walt and Jesse get stranded in the desert.", rating: "9.1" },
                        { title: "Over", plot: "Walt tries to settle back into domestic life.", rating: "8.5" },
                        { title: "Mandala", plot: "Walt and Jesse meet a high-level distributor.", rating: "8.9" },
                        { title: "Phoenix", plot: "Walt misses the birth of his daughter to make a delivery.", rating: "9.3" },
                        { title: "ABQ", plot: "Skyler confronts Walt about his lies.", rating: "9.2" }
                    ]
                },
                {
                    seasonNumber: 3,
                    episodes: [
                        { title: "No Más", plot: "Skyler wants a divorce. Walt tries to move back in.", rating: "8.6" },
                        { title: "Caballo sin Nombre", plot: "Walt tries to bond with his son. Mike visits Walt.", rating: "8.7" },
                        { title: "I.F.T.", plot: "Walt moves back home. Skyler sleeps with Ted.", rating: "8.5" },
                        { title: "Green Light", plot: "Walt confronts Ted. Jesse makes a deal.", rating: "8.3" },
                        { title: "Más", plot: "Gus offers Walt a job. Hank tracks the RV.", rating: "8.7" },
                        { title: "Sunset", plot: "Walt destroys the RV. Hank closes in on Jesse.", rating: "9.3" },
                        { title: "One Minute", plot: "Hank assaults Jesse. The Cousins come for Hank.", rating: "9.6" },
                        { title: "I See You", plot: "Jesse is discharged. Walt worries about Hank.", rating: "8.8" },
                        { title: "Kafkaesque", plot: "Jesse skims off the top. Skyler concocts a story.", rating: "8.5" },
                        { title: "Fly", plot: "Walt becomes obsessed with a contaminant in the lab.", rating: "7.8" },
                        { title: "Abiquiu", plot: "Jesse meets a girl. Skyler gets involved in the money laundering.", rating: "8.4" },
                        { title: "Half Measures", plot: "Jesse seeks revenge. Walt intervenes.", rating: "9.5" },
                        { title: "Full Measure", plot: "Walt and Jesse face a life or death situation.", rating: "9.7" }
                    ]
                },
                {
                    seasonNumber: 4,
                    episodes: [
                        { title: "Box Cutter", plot: "Walt and Jesse face the consequences of their actions.", rating: "9.2" },
                        { title: "Thirty-Eight Snub", plot: "Walt buys a gun. Jesse throws a party.", rating: "8.3" },
                        { title: "Open House", plot: "Skyler negotiates for the car wash. Marie starts stealing again.", rating: "8.1" },
                        { title: "Bullet Points", plot: "Walt and Skyler prepare their story. Jesse goes off the deep end.", rating: "8.5" },
                        { title: "Shotgun", plot: "Jesse rides shotgun with Mike. Walt thinks Hank is on to him.", rating: "8.7" },
                        { title: "Cornered", plot: "Skyler protects the family. Walt reveals his danger.", rating: "8.5" },
                        { title: "Problem Dog", plot: "Jesse deals with his guilt. Walt negotiates with Gus.", rating: "8.9" },
                        { title: "Hermanos", plot: "Gus's past is revealed. Hank gets closer to the truth.", rating: "9.3" },
                        { title: "Bug", plot: "Hank investigates the laundry. Walt and Jesse fight.", rating: "8.9" },
                        { title: "Salud", plot: "Gus takes Jesse to Mexico. Walt misses his son's birthday.", rating: "9.6" },
                        { title: "Crawl Space", plot: "Gus threatens Walt's family. Walt breaks down.", rating: "9.7" },
                        { title: "End Times", plot: "Hank is threatened. Walt protects his family.", rating: "9.5" },
                        { title: "Face Off", plot: "Walt and Jesse team up to take down Gus.", rating: "9.9" }
                    ]
                },
                {
                    seasonNumber: 5,
                    episodes: [
                        { title: "Live Free or Die", plot: "Walt deals with the aftermath of the explosion.", rating: "9.2" },
                        { title: "Madrigal", plot: "Mike deals with the fallout. Walt and Jesse start cooking again.", rating: "8.9" },
                        { title: "Hazard Pay", plot: "The guys discuss business. Skyler is terrified.", rating: "8.8" },
                        { title: "Fifty-One", plot: "Walt celebrates his 51st birthday. Skyler tries to protect the kids.", rating: "8.9" },
                        { title: "Dead Freight", plot: "The gang plans a train heist.", rating: "9.7" },
                        { title: "Buyout", plot: "Walt, Jesse, and Mike discuss the future of the business.", rating: "9.0" },
                        { title: "Say My Name", plot: "Walt demands recognition. Mike tries to leave town.", rating: "9.5" },
                        { title: "Gliding Over All", plot: "Walt ties up loose ends. Hank makes a discovery.", rating: "9.6" },
                        { title: "Blood Money", plot: "Hank confronts Walt. Jesse tries to give his money away.", rating: "9.5" },
                        { title: "Buried", plot: "Skyler is questioned by Hank. Walt buries his money.", rating: "9.1" },
                        { title: "Confessions", plot: "Walt makes a confession video. Jesse realizes the truth.", rating: "9.6" },
                        { title: "Rabid Dog", plot: "Saul suggests a solution. Walt protects Jesse.", rating: "9.2" },
                        { title: "To'hajiilee", plot: "Hank sets a trap for Walt. Gunfire erupts.", rating: "9.8" },
                        { title: "Ozymandias", plot: "Walt goes on the run. The family falls apart.", rating: "10.0" },
                        { title: "Granite State", plot: "Walt hides out in New Hampshire. Jesse tries to escape.", rating: "9.1" },
                        { title: "Felina", plot: "Walt returns to Albuquerque to settle his affairs.", rating: "9.9" }
                    ]
                }
            ]
        }
    },
    // Stranger Things
    'tt4574334': {
        success: true,
        result: {
            Title: "Stranger Things",
            Year: "2016",
            Rated: "TV-14",
            Genre: "Drama, Fantasy, Horror",
            Actors: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder",
            Plot: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
            Poster: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            imdbRating: "8.7",
            imdbID: "tt4574334",
            Type: "series",
            totalSeasons: "4",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Chapter One: The Vanishing of Will Byers", plot: "On his way home from a friend's house, young Will Byers sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.", rating: "8.5" },
                        { title: "Chapter Two: The Weirdo on Maple Street", plot: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.", rating: "8.4" },
                        { title: "Chapter Three: Holly, Jolly", plot: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her.", rating: "8.8" },
                        { title: "Chapter Four: The Body", plot: "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover. Nancy and Jonathan form an unlikely alliance.", rating: "8.9" },
                        { title: "Chapter Five: The Flea and the Acrobat", plot: "Hopper breaks into the lab while Nancy and Jonathan confront the force that took Will. The boys ask Mr. Clarke how to travel to another dimension.", rating: "8.7" },
                        { title: "Chapter Six: The Monster", plot: "A frantic Jonathan looks for Nancy in the darkness, but Steve's looking for her, too. Hopper and Joyce uncover the truth about the lab's experiments.", rating: "8.9" },
                        { title: "Chapter Seven: The Bathtub", plot: "Eleven struggles to reach Will, while Lucas warns that \"the bad men are coming.\" Nancy and Jonathan show the police what Jonathan caught on camera.", rating: "9.0" },
                        { title: "Chapter Eight: The Upside Down", plot: "Dr. Brenner holds Hopper and Joyce for questioning while the boys wait with Eleven in the gym. Back at Will's house, the duo prepares to fight.", rating: "9.3" }
                    ]
                }
            ]
        }
    },
    // The Walking Dead
    'tt1520211': {
        success: true,
        result: {
            Title: "The Walking Dead",
            Year: "2010",
            Rated: "TV-MA",
            Genre: "Drama, Horror, Thriller",
            Actors: "Andrew Lincoln, Norman Reedus, Melissa McBride",
            Plot: "Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors to stay alive.",
            Poster: "https://image.tmdb.org/t/p/original/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg",
            imdbRating: "8.1",
            imdbID: "tt1520211",
            Type: "series",
            totalSeasons: "11",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Days Gone Bye", plot: "Rick searches for his family after emerging from a coma into a world terrorized by the walking dead. Morgan and Duane, whom he meets along the way, help teach him the new rules for survival.", rating: "9.2" },
                        { title: "Guts", plot: "Rick unknowingly causes a group of survivors to be trapped by walkers. The group dynamic devolves from accusations to violence, as Rick must confront an enemy far more dangerous than the undead.", rating: "8.6" },
                        { title: "Tell It to the Frogs", plot: "Rick makes a decision to go back to Atlanta to retrieve the bag of guns and save a man's life. Lori and Shane must deal with the surprise return of someone they thought was dead.", rating: "8.3" },
                        { title: "Vatos", plot: "Rick's mission to Atlanta is jeopardized when things go awry. Jim becomes unhinged in camp.", rating: "8.6" },
                        { title: "Wildfire", plot: "Rick leads the group to the CDC after the attack on the camp. Jim must make a terrible life and death decision.", rating: "8.7" },
                        { title: "TS-19", plot: "A strange doctor allows the survivors into the CDC. However, all is not as it seems in their newfound haven.", rating: "8.8" }
                    ]
                }
            ]
        }
    },
    // Friends
    'tt0108778': {
        success: true,
        result: {
            Title: "Friends",
            Year: "1994",
            Rated: "TV-14",
            Genre: "Comedy, Romance",
            Actors: "Jennifer Aniston, Courteney Cox, Lisa Kudrow, Matt LeBlanc",
            Plot: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
            Poster: "https://image.tmdb.org/t/p/original/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
            imdbRating: "8.9",
            imdbID: "tt0108778",
            Type: "series",
            totalSeasons: "10",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The One Where Monica Gets a Roommate", plot: "Monica and the gang introduce Rachel to the \"real world\" after she leaves her fiancé at the altar.", rating: "8.3" },
                        { title: "The One with the Sonogram at the End", plot: "Ross finds out his ex-wife is pregnant. Rachel returns her engagement ring to Barry.", rating: "8.1" },
                        { title: "The One with the Thumb", plot: "Monica finds it difficult to break up with her boyfriend. Chandler starts smoking again.", rating: "8.2" },
                        { title: "The One with George Stephanopoulos", plot: "Joey and Chandler take Ross to a hockey game to take his mind off the anniversary of the first time he slept with Carol.", rating: "8.1" },
                        { title: "The One with the East German Laundry Detergent", plot: "Ross and Rachel wash clothes together. Joey has a date with an ex-girlfriend.", rating: "8.5" },
                        { title: "The One with the Butt", plot: "Chandler has a fling with a woman who has a boyfriend. Joey gets a movie role.", rating: "8.1" },
                        { title: "The One with the Blackout", plot: "A power outage traps Chandler in an ATM vestibule with a model.", rating: "9.0" },
                        { title: "The One Where Nana Dies Twice", plot: "Ross and Monica say goodbye to their grandmother. Chandler is shocked to find out that many people think he is gay.", rating: "8.1" },
                        { title: "The One Where Underdog Gets Away", plot: "The gang's plans for Thanksgiving go awry when they get locked out of the apartment.", rating: "8.2" },
                        { title: "The One with the Monkey", plot: "The gang makes a pact not to bring dates to their New Year's Eve party.", rating: "8.0" }
                    ]
                }
            ]
        }
    },
    // Squid Game
    'tt10919420': {
        success: true,
        result: {
            Title: "Squid Game",
            Year: "2021",
            Rated: "TV-MA",
            Genre: "Action, Drama, Mystery",
            Actors: "Lee Jung-jae, Park Hae-soo, Wi Ha-joon",
            Plot: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
            Poster: "https://image.tmdb.org/t/p/original/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
            imdbRating: "8.0",
            imdbID: "tt10919420",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Red Light, Green Light", plot: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.", rating: "8.4" },
                        { title: "Hell", plot: "Split on whether to continue or quit, the group holds a vote. But their realities in the outside world may prove to be just as unforgiving as the game.", rating: "8.2" },
                        { title: "The Man with the Umbrella", plot: "A few players enter the next round with hidden advantages. Meanwhile, Jun-ho sneaks his way inside.", rating: "8.3" },
                        { title: "Stick to the Team", plot: "As alliances form among the players, no one is safe in the dormitory after lights out.", rating: "8.5" },
                        { title: "A Fair World", plot: "Gi-hun and his team keep watch through the night. The masked men encounter trouble with their co-conspirators.", rating: "8.3" },
                        { title: "Gganbu", plot: "Players pair off for the fourth game. Gi-hun struggles with a moral dilemma, Sang-woo chooses self-preservation, and Sae-byeok shares her untold story.", rating: "9.3" },
                        { title: "VIPS", plot: "The Masked Leader welcomes VIP guests to view the show. In the fifth game, some players crack under pressure.", rating: "8.0" },
                        { title: "Front Man", plot: "Before the final round, distrust and disgust run deep among the finalists. Jun-ho makes a getaway, determined to expose the game's dirty secrets.", rating: "8.1" },
                        { title: "One Lucky Day", plot: "The final round presents another cruel test, but this time, how it ends depends on just one player.", rating: "8.0" }
                    ]
                }
            ]
        }
    },
    // Pluribus
    'tt_pluribus': {
        success: true,
        result: {
            Title: "Pluribus",
            Year: "2025",
            Rated: "TV-MA",
            Genre: "Sci-Fi, Documentary, Drama",
            Plot: "A groundbreaking poker AI achieves sentience, challenging the world's best players and redefining the boundaries of machine intelligence.",
            Poster: "https://www.themoviedb.org/t/p/w1280/nrM2xFUfKJJEmZzd5d7kohT2G0C.jpg",
            imdbRating: "N/A",
            imdbID: "tt_pluribus",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Deal", plot: "The AI system Pluribus is unveiled to the world, shocking the poker community.", rating: "N/A" },
                        { title: "The Flop", plot: "Pluribus faces its first human grandmaster.", rating: "N/A" },
                        { title: "The Turn", plot: "Government agencies take an interest in the code.", rating: "N/A" },
                        { title: "The River", plot: "The season finale. Humanity's best faces the machine.", rating: "N/A" }
                    ]
                }
            ]
        }
    },
    // Heated Rivalry
    'tt_heated': {
        success: true,
        result: {
            Title: "Heated Rivalry",
            Year: "2025",
            Rated: "TV-MA",
            Genre: "Romance, Drama, Sport",
            Plot: "Based on the bestselling novel. Two hockey stars share a long-standing rivalry that turns into a passionate and secret romance.",
            Poster: "https://www.themoviedb.org/t/p/w1280/epgr7n61vVIniyAghz2GYj22DkC.jpg",
            imdbRating: "N/A",
            imdbID: "tt_heated",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Face Off", plot: "Shane and Ilya meet on the ice for the first time in the season.", rating: "N/A" },
                        { title: "Penalty Box", plot: "A night out leads to unexpected consequences.", rating: "N/A" }
                    ]
                }
            ]
        }
    },
    // Fallout
    'tt12637874': {
        success: true,
        result: {
            Title: "Fallout",
            Year: "2024",
            Rated: "TV-MA",
            Genre: "Action, Adventure, Drama",
            Actors: "Ella Purnell, Aaron Moten, Walton Goggins",
            Plot: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves.",
            Poster: "https://media.themoviedb.org/t/p/original/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg",
            imdbRating: "8.4",
            imdbID: "tt12637874",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The End", plot: "A peaceful dweller of Vault 33 leaves her home to find her father on the surface.", rating: "8.6" },
                        { title: "The Target", plot: "The Ghoul hunts a bounty. Maxwell seeks a target. Lucy meets a wasteland inhabitant.", rating: "8.5" },
                        { title: "The Head", plot: "Lucy and the Ghoul's paths cross in a dangerous town.", rating: "8.4" },
                        { title: "The Ghouls", plot: "Lucy learns the history of the Ghouls.", rating: "8.7" },
                        { title: "The Past", plot: "Flashbacks reveal the origins of the apocalypse.", rating: "8.6" },
                        { title: "The Trap", plot: "A trap is set for the unwary traveler.", rating: "8.5" },
                        { title: "The Radio", plot: "A mysterious signal broadcasts across the wasteland.", rating: "8.6" },
                        { title: "The Beginning", plot: "Season finale. All roads lead to the Observatory.", rating: "8.9" }
                    ]
                }
            ]
        }
    },
    // IT: Welcome to Derry
    'tt22061614': {
        success: true,
        result: {
            Title: "IT: Welcome to Derry",
            Year: "2025",
            Rated: "TV-MA",
            Genre: "Horror, Mystery",
            Plot: "Set in the 1960s, four children in a town called Derry, Maine, discover a shapeshifting creature.",
            Poster: "https://www.themoviedb.org/t/p/w1280/nyy3BITeIjviv6PFIXtqvc8i6xi.jpg",
            imdbRating: "N/A",
            imdbID: "tt22061614",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Sewer", plot: "Strange occurrences begin in Derry.", rating: "N/A" },
                        { title: "The Clown", plot: "A circus comes to town.", rating: "N/A" }
                    ]
                }
            ]
        }
    },
    // Landman
    'tt_landman': {
        success: true,
        result: {
            Title: "Landman",
            Year: "2024",
            Rated: "TV-MA",
            Genre: "Drama",
            Actors: "Billy Bob Thornton, Jon Hamm",
            Plot: "Set in the proverbial boomtowns of West Texas, Landman is a modern-day tale of fortune seeking in the world of oil rigs.",
            Poster: "https://www.themoviedb.org/t/p/w1280/hYthRgS1nvQkGILn9YmqsF8kSk6.jpg",
            imdbRating: "N/A",
            imdbID: "tt_landman",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Landman", plot: "Series premiere. The oil business is booming.", rating: "N/A" },
                        { title: "The Rig", plot: "Trouble strikes on the rig.", rating: "N/A" }
                    ]
                }
            ]
        }
    },
    // Black Adam
    'tt6443346': {
        success: true,
        result: {
            Title: "Black Adam",
            Year: "2022",
            Rated: "PG-13",
            Released: "21 Oct 2022",
            Runtime: "125 min",
            Genre: "Action, Adventure, Fantasy",
            Director: "Jaume Collet-Serra",
            Writer: "Adam Sztykiel, Rory Haines, Sohrab Noshirvani",
            Actors: "Dwayne Johnson, Aldis Hodge, Pierce Brosnan",
            Plot: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.",
            Language: "English",
            Country: "United States",
            Poster: "https://image.tmdb.org/t/p/original/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "6.3/10" }
            ],
            imdbRating: "6.3",
            imdbVotes: "250,000",
            imdbID: "tt6443346",
            Type: "movie",
            BoxOffice: "$393,000,000",
            Production: "Warner Bros. Pictures"
        }
    },
    // Top Gun: Maverick
    'tt1745960': {
        success: true,
        result: {
            Title: "Top Gun: Maverick",
            Year: "2022",
            Rated: "PG-13",
            Released: "27 May 2022",
            Runtime: "130 min",
            Genre: "Action, Drama",
            Director: "Joseph Kosinski",
            Writer: "Ehren Kruger, Eric Warren Singer, Christopher McQuarrie",
            Actors: "Tom Cruise, Jennifer Connelly, Miles Teller",
            Plot: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
            Language: "English",
            Country: "United States",
            Poster: "https://m.media-amazon.com/images/I/71BokibfVUL._SL1500_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.3/10" }
            ],
            imdbRating: "8.3",
            imdbVotes: "600,000",
            imdbID: "tt1745960",
            Type: "movie",
            BoxOffice: "$1,493,000,000",
            Production: "Paramount Pictures"
        }
    },
    // Severance
    'tt11280740': {
        success: true,
        result: {
            Title: "Severance",
            Year: "2022",
            Rated: "TV-MA",
            Genre: "Drama, Mystery, Sci-Fi",
            Actors: "Adam Scott, Zach Cherry, Britt Lower",
            Plot: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
            Poster: "https://media.themoviedb.org/t/p/original/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
            imdbRating: "8.7",
            imdbID: "tt11280740",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Good News About Hell", plot: "Mark gets promoted to lead a team who have had their memories surgically divided between their work and personal lives.", rating: "8.4" },
                        { title: "Half Loop", plot: "The team trains new hire Helly on macrodata refinement. Mark takes a day off to meet with a former colleague.", rating: "8.2" },
                        { title: "In Perpetuity", plot: "Helly rebels against her new job. Mark and the others take her to the Break Room.", rating: "8.0" },
                        { title: "The You You Are", plot: "Irving finds an intriguing book at work. Helly aggressively pushes for a meeting with her Outie.", rating: "8.5" },
                        { title: "The Grim Barbarity of Optics and Design", plot: "Irving and Dylan visit the Optics and Design department. Mark and Helly sneak away to find new departments.", rating: "8.6" },
                        { title: "Hide and Seek", plot: "The team angers management. Mark meets with the person who left the book.", rating: "8.7" },
                        { title: "Defiant Jazz", plot: "Mark, Irving, and Dylan find the Security Office. Helly reaches a breaking point.", rating: "9.2" },
                        { title: "What's for Dinner?", plot: "The team prepares a plan. Mark attends a party at his sister's house.", rating: "9.5" },
                        { title: "The We We Are", plot: "The team discovers significant truths about their outside lives.", rating: "9.8" }
                    ]
                }
            ]
        }
    },
    // Fargo
    'tt2802850': {
        success: true,
        result: {
            Title: "Fargo",
            Year: "2014",
            Rated: "TV-MA",
            Genre: "Crime, Drama, Thriller",
            Actors: "Billy Bob Thornton, Martin Freeman, Allison Tolman",
            Plot: "Various chronicles of deception, intrigue and murder in and around frozen Minnesota. Yet all of these tales mysteriously lead back one way or another to Fargo, North Dakota.",
            Poster: "https://www.themoviedb.org/t/p/w1280/6U9CPeD8obHzweikFhiLhpc7YBT.jpg",
            imdbRating: "8.9",
            imdbID: "tt2802850",
            Type: "series",
            totalSeasons: "4",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Crocodile's Dilemma", plot: "A rootless, manipulative man meets a small town insurance salesman and sets him on a path of destruction.", rating: "9.3" },
                        { title: "The Rooster Prince", plot: "Molly begins to suspect that Lester is involved in the murders.", rating: "8.7" },
                        { title: "A Muddy Road", plot: "Malvo flips the script on the blackmail operation. Molly sets a trap.", rating: "8.8" },
                        { title: "Eating the Blame", plot: "Gus and Molly team up in Duluth. Malvo embraces his alter ego.", rating: "8.7" },
                        { title: "The Six Ungraspables", plot: "Things heat up for Lester. Malvo finds a new target.", rating: "9.0" },
                        { title: "Buridan's Ass", plot: "Malvo executes his master plan. Lester attempts to craft his own destiny.", rating: "9.3" },
                        { title: "Who Shaves the Barber?", plot: "Molly takes the lead. Gus pursues a hunch. Lester finds himself in a surprising situation.", rating: "8.9" },
                        { title: "The Heap", plot: "Looking for answers, Molly faces a roadblock.", rating: "8.8" },
                        { title: "A Fox, a Rabbit, and a Cabbage", plot: "Lester has an unexpected encounter. Malvo changes course.", rating: "9.0" },
                        { title: "Morton's Fork", plot: "Molly takes the lead. Gus pursues a hunch. Lester manipulates the situation.", rating: "9.4" }
                    ]
                }
            ]
        }
    },
    // Grey's Anatomy
    'tt0413573': {
        success: true,
        result: {
            Title: "Grey's Anatomy",
            Year: "2005",
            Rated: "TV-14",
            Genre: "Drama, Romance",
            Actors: "Ellen Pompeo, Chandra Wilson, James Pickens Jr.",
            Plot: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.",
            Poster: "https://www.themoviedb.org/t/p/w1280/hjJkrLXhWvGHpLeLBDFznpBTY1S.jpg",
            imdbRating: "7.6",
            imdbID: "tt0413573",
            Type: "series",
            totalSeasons: "19",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "A Hard Day's Night", plot: "Meredith Grey enrolls in a rigorous surgical residency program.", rating: "8.4" },
                        { title: "The First Cut Is the Deepest", plot: "Meredith looks for a roommate. George's patient dies.", rating: "8.1" },
                        { title: "Winning a Battle, Losing the War", plot: "The interns compete to treat patients.", rating: "8.0" },
                        { title: "No Man's Land", plot: "Izzie struggles with being objectified. George feels emasculated.", rating: "8.1" },
                        { title: "Shake Your Groove Thing", plot: "Meredith realizes she may be in trouble during a surgery.", rating: "8.2" },
                        { title: "If Tomorrow Never Comes", plot: "Alex works hard to gain the trust of a patient.", rating: "8.1" },
                        { title: "The Self-Destruct Button", plot: "Derek and Meredith try to be discreet.", rating: "8.1" },
                        { title: "Save Me", plot: "Alex treats a patient whose religious beliefs jeopardize her recovery.", rating: "8.2" },
                        { title: "Who's Zoomin' Who?", plot: "An outbreak of syphilis among the staff.", rating: "8.7" }
                    ]
                }
            ]
        }
    },
    // Orange Is the New Black
    'tt2372162': {
        success: true,
        result: {
            Title: "Orange Is the New Black",
            Year: "2013",
            Rated: "TV-MA",
            Genre: "Comedy, Crime, Drama",
            Actors: "Taylor Schilling, Danielle Brooks, Taryn Manning",
            Plot: "Convicted of a decade old crime of transporting drug money to an ex-girlfriend, normally law-abiding Piper Chapman is sentenced to a year and a half behind bars.",
            Poster: "https://www.themoviedb.org/t/p/w1280/ekaa7YjGPTkFLcPhwWXTnARuCEU.jpg",
            imdbRating: "8.0",
            imdbID: "tt2372162",
            Type: "series",
            totalSeasons: "7",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "I Wasn't Ready", plot: "Piper Chapman surrenders herself to Litchfield Penitentiary.", rating: "8.0" },
                        { title: "Tit Punch", plot: "Piper gets starved out by Red.", rating: "8.1" },
                        { title: "Lesbian Request Denied", plot: "Piper deals with advances from a fellow inmate.", rating: "8.0" },
                        { title: "Imaginary Enemies", plot: "Piper gets involved in prison politics.", rating: "8.1" },
                        { title: "The Chickening", plot: "A chicken sighting causes a frenzy.", rating: "8.3" },
                        { title: "WAC Pack", plot: "The inmates vote for a representative.", rating: "8.0" },
                        { title: "Blood Donut", plot: "Piper tries to make amends.", rating: "8.1" },
                        { title: "Moscow Mule", plot: "Red tries to smuggle goods in.", rating: "8.2" },
                        { title: "Fucksgiving", plot: "Piper is sent to solitary confinement.", rating: "8.5" },
                        { title: "Bora Bora Bora", plot: "Tensions rise in the prison.", rating: "8.2" }
                    ]
                }
            ]
        }
    },
    // Riverdale
    'tt5421782': {
        success: true,
        result: {
            Title: "Riverdale",
            Year: "2017",
            Rated: "TV-14",
            Genre: "Crime, Drama, Mystery",
            Actors: "K.J. Apa, Lili Reinhart, Camila Mendes",
            Plot: "While navigating the troubled waters of romance, school and family, Archie and his gang become entangled in dark Riverdale mysteries.",
            Poster: "https://www.themoviedb.org/t/p/w1280/d8mmn9thQ5dBk2qbv6BCqGUXWK3.jpg",
            imdbRating: "6.5",
            imdbID: "tt5421782",
            Type: "series",
            totalSeasons: "7",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Chapter One: The River's Edge", plot: "The town reels from the death of high school golden boy Jason Blossom.", rating: "7.7" },
                        { title: "Chapter Two: A Touch of Evil", plot: "Archie pleads with Miss Grundy to come forward with what they heard.", rating: "7.5" },
                        { title: "Chapter Three: Body Double", plot: "Cheryl is under suspicion. Archie decides to come clean.", rating: "7.8" },
                        { title: "Chapter Four: The Last Picture Show", plot: "Jughead fights to keep the local drive-in open.", rating: "7.9" },
                        { title: "Chapter Five: Heart of Darkness", plot: "The Blossoms prepare for Jason's funeral.", rating: "8.0" },
                        { title: "Chapter Six: Faster, Pussycats! Kill! Kill!", plot: "Valerie helps Archie with his music. Josie confronts her father.", rating: "7.9" },
                        { title: "Chapter Seven: In a Lonely Place", plot: "Rumors swirl as to who is really behind Jason's murder.", rating: "7.8" },
                        { title: "Chapter Eight: The Outsiders", plot: "Fred loses his crew. Archie steps up to help his dad.", rating: "7.6" }
                    ]
                }
            ]
        }
    },
    // How I Met Your Mother
    'tt0460649': {
        success: true,
        result: {
            Title: "How I Met Your Mother",
            Year: "2005",
            Rated: "TV-14",
            Genre: "Comedy, Romance",
            Actors: "Josh Radnor, Jason Segel, Cobie Smulders",
            Plot: "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother.",
            Poster: "https://www.themoviedb.org/t/p/w1280/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
            imdbRating: "8.3",
            imdbID: "tt0460649",
            Type: "series",
            totalSeasons: "9",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Pilot", plot: "Ted falls for Robin. Marshall proposes to Lily.", rating: "8.3" },
                        { title: "Purple Giraffe", plot: "Ted throws a party to see Robin again.", rating: "8.2" },
                        { title: "Sweet Taste of Liberty", plot: "Barney decides it's time to teach Ted how to live.", rating: "8.1" },
                        { title: "Return of the Shirt", plot: "Ted reconnects with an old flame.", rating: "7.9" },
                        { title: "Okay Awesome", plot: "The gang goes to a club.", rating: "8.3" },
                        { title: "The Slutty Pumpkin", plot: "Ted waits for the Slutty Pumpkin.", rating: "8.5" },
                        { title: "Matchmaker", plot: "Ted visits a matchmaker.", rating: "8.1" },
                        { title: "The Duel", plot: "Ted and Marshall have a sword fight.", rating: "8.2" },
                        { title: "Belly Full of Turkey", plot: "Thanksgiving at the Eriksens.", rating: "8.1" },
                        { title: "The Pineapple Incident", plot: "Ted wakes up with a pineapple and no memory of the night before.", rating: "9.1" }
                    ]
                }
            ]
        }
    },
    // Black Mirror
    'tt2085059': {
        success: true,
        result: {
            Title: "Black Mirror",
            Year: "2011",
            Rated: "TV-MA",
            Genre: "Drama, Mystery, Sci-Fi",
            Actors: "Daniel Lapaine, Hannah John-Kamen, Michaela Coel",
            Plot: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
            Poster: "https://www.themoviedb.org/t/p/w1280/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
            imdbRating: "8.8",
            imdbID: "tt2085059",
            Type: "series",
            totalSeasons: "6",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The National Anthem", plot: "Prime Minister Michael Callow faces a shocking dilemma when Princess Susannah is kidnapped.", rating: "7.7" },
                        { title: "Fifteen Million Merits", plot: "In a world where people must cycle to earn currency, Bing helps a woman get on a talent show.", rating: "8.1" },
                        { title: "The Entire History of You", plot: "A man with a memory implant becomes obsessed with his wife's past relationship.", rating: "8.5" }
                    ]
                }
            ]
        }
    },
    // The Mandalorian
    'tt8111088': {
        success: true,
        result: {
            Title: "The Mandalorian",
            Year: "2019",
            Rated: "TV-14",
            Genre: "Action, Adventure, Fantasy",
            Actors: "Pedro Pascal, Carl Weathers, Giancarlo Esposito",
            Plot: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
            Poster: "https://media.themoviedb.org/t/p/original/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
            imdbRating: "8.7",
            imdbID: "tt8111088",
            Type: "series",
            totalSeasons: "3",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Chapter 1: The Mandalorian", plot: "A Mandalorian bounty hunter tracks a target for a well-paying, mysterious client.", rating: "8.5" },
                        { title: "Chapter 2: The Child", plot: "Target in hand, the Mandalorian must now contend with scavengers.", rating: "8.3" },
                        { title: "Chapter 3: The Sin", plot: "The battered Mandalorian returns to his client for his reward.", rating: "8.6" },
                        { title: "Chapter 4: Sanctuary", plot: "The Mandalorian teams up with an ex-soldier to protect a village from raiders.", rating: "7.6" },
                        { title: "Chapter 5: The Gunslinger", plot: "The Mandalorian helps a rookie bounty hunter who is in over his head.", rating: "7.3" },
                        { title: "Chapter 6: The Prisoner", plot: "The Mandalorian joins a crew of mercenaries on a dangerous mission.", rating: "8.1" },
                        { title: "Chapter 7: The Reckoning", plot: "An old rival extends an invitation for the Mandalorian to make peace.", rating: "8.9" },
                        { title: "Chapter 8: Redemption", plot: "Season finale. The Mandalorian comes face-to-face with an unexpected enemy.", rating: "9.2" }
                    ]
                }
            ]
        }
    },
    // Peaky Blinders
    'tt2442560': {
        success: true,
        result: {
            Title: "Peaky Blinders",
            Year: "2013",
            Rated: "TV-MA",
            Genre: "Crime, Drama",
            Actors: "Cillian Murphy, Paul Anderson, Sophie Rundle",
            Plot: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
            Poster: "https://media.themoviedb.org/t/p/original/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
            imdbRating: "8.8",
            imdbID: "tt2442560",
            Type: "series",
            totalSeasons: "6",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Episode 1", plot: "Thomas Shelby prepares to fix a horse race. A new inspector arrives in Birmingham.", rating: "8.1" },
                        { title: "Episode 2", plot: "Thomas starts a war with the Lee family. Campbell raids the Peaky Blinders' turf.", rating: "8.3" },
                        { title: "Episode 3", plot: "Thomas approaches Billy Kimber. Grace gets deeper into her undercover role.", rating: "8.2" },
                        { title: "Episode 4", plot: "Thomas strikes a deal with the Lees. Campbell puts pressure on the gang.", rating: "8.4" },
                        { title: "Episode 5", plot: "Thomas prepares to oust Billy Kimber. Secrets are revealed.", rating: "8.6" },
                        { title: "Episode 6", plot: "The Peaky Blinders prepare for a showdown with Billy Kimber.", rating: "9.0" }
                    ]
                }
            ]
        }
    },
    // Homeland
    'tt1796960': {
        success: true,
        result: {
            Title: "Homeland",
            Year: "2011",
            Rated: "TV-MA",
            Genre: "Crime, Drama, Mystery",
            Actors: "Claire Danes, Mandy Patinkin, Damian Lewis",
            Plot: "A bipolar CIA operative becomes convinced a prisoner of war has been turned by al-Qaeda and is planning to carry out a terrorist attack on American soil.",
            Poster: "https://www.themoviedb.org/t/p/w1280/6GAvS2e6VIRsms9FpVt33PsCoEW.jpg",
            imdbRating: "8.3",
            imdbID: "tt1796960",
            Type: "series",
            totalSeasons: "8",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Pilot", plot: "Carrie Mathison believes a rescued POW is a terrorist spy.", rating: "8.3" },
                        { title: "Grace", plot: "Carrie continues to surveil Brody.", rating: "8.0" },
                        { title: "Clean Skin", plot: "The CIA prepares to debunk Brody's story.", rating: "8.1" },
                        { title: "Semper I", plot: "Brody's public profile rises.", rating: "7.9" },
                        { title: "Blind Spot", plot: "Brody confronts the lone survivor of the insurgents.", rating: "8.4" },
                        { title: "The Good Soldier", plot: "The CIA finally polygrahs Brody.", rating: "8.3" },
                        { title: "The Weekend", plot: "Carrie and Brody head to the countryside.", rating: "8.8" },
                        { title: "Achilles Heel", plot: "Carrie and Saul get a lead on Walker.", rating: "8.3" },
                        { title: "Crossfire", plot: "Brody meets with Abu Nazir.", rating: "8.4" },
                        { title: "Representative Brody", plot: "Brody is asked to run for office.", rating: "8.2" },
                        { title: "The Vest", plot: "Carrie's condition worsens. The timeline for the attack moves up.", rating: "8.7" },
                        { title: "Marine One", plot: "The season finale. Brody prepares to fulfill his mission.", rating: "9.0" }
                    ]
                }
            ]
        }
    },
    // Anime Section
    // One Piece
    'tt0388629': {
        success: true,
        result: {
            Title: "One Piece",
            Year: "1999",
            Rated: "TV-14",
            Released: "20 Oct 1999",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Eiichiro Oda",
            Actors: "Mayumi Tanaka, Akemi Okamura, Kazuya Nakai, Kappei Yamaguchi",
            Plot: "Monkey D. Luffy and his pirate crew explore the Grand Line in search of the ultimate treasure, the One Piece, to become the King of the Pirates.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.9/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.9",
            imdbVotes: "150,000",
            imdbID: "tt0388629",
            Type: "series",
            totalSeasons: "20+",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "I'm Luffy! The Man Who's Gonna Be King of the Pirates!", plot: "Luffy sets out on his journey to become the King of the Pirates.", rating: "8.5" },
                        { title: "Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!", plot: "Luffy meets the legendary swordsman Zoro.", rating: "8.6" },
                        { title: "Morgan vs. Luffy! Who's This Beautiful Young Girl?", plot: "Luffy and Zoro face off against Captain Morgan.", rating: "8.4" },
                        { title: "Luffy's Past! The Red-Haired Shanks Appears!", plot: "Flashback to Luffy's childhood and his meeting with Shanks.", rating: "8.8" },
                        { title: "Fear, Mysterious Power! Pirate Clown Captain Buggy!", plot: "The crew encounters the pirate clown Buggy.", rating: "8.3" }
                    ]
                }
            ]
        }
    },
    // Naruto
    'tt0409591': {
        success: true,
        result: {
            Title: "Naruto",
            Year: "2002",
            Rated: "TV-14",
            Released: "03 Oct 2002",
            Runtime: "23 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Masashi Kishimoto",
            Actors: "Junko Takeuchi, Maile Flanagan, Kate Higgins, Chie Nakamura",
            Plot: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.4/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.4",
            imdbVotes: "125,000",
            imdbID: "tt0409591",
            Type: "series",
            totalSeasons: "5",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Enter: Naruto Uzumaki!", plot: "Naruto steals the Forbidden Scroll to learn powerful jutsu.", rating: "8.2" },
                        { title: "My Name is Konohamaru!", plot: "Naruto meets and trains the Hokage's grandson.", rating: "7.9" },
                        { title: "Sasuke and Sakura: Friends or Foes?", plot: "Team 7 is formed with Naruto, Sasuke, and Sakura.", rating: "8.0" },
                        { title: "Pass or Fail: Survival Test", plot: "Kakashi tests Team 7 with the bell test.", rating: "8.3" }
                    ]
                }
            ]
        }
    },
    // Pokemon
    'tt0176385': {
        success: true,
        result: {
            Title: "Pokémon",
            Year: "1997",
            Rated: "TV-Y7",
            Released: "01 Apr 1997",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Satoshi Tajiri, Junichi Masuda, Ken Sugimori",
            Actors: "Veronica Taylor, Rachael Lillis, Eric Stuart, Ikue Ōtani",
            Plot: "Ash Ketchum and his partner Pikachu travel across many regions to become a Pokemon Master, catching and training Pokemon while battling other trainers.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BMzE0ZDU1MzQtNTNlYS00YjNlLWE2ODktZmFmNDYzMTBlZTBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.5/10" }
            ],
            Metascore: "N/A",
            imdbRating: "7.5",
            imdbVotes: "95,000",
            imdbID: "tt0176385",
            Type: "series",
            totalSeasons: "25",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Pokémon - I Choose You!", plot: "Ash begins his journey to become a Pokemon Master.", rating: "8.3" },
                        { title: "Pokémon Emergency!", plot: "Ash rushes Pikachu to the Pokemon Center after a battle.", rating: "8.0" },
                        { title: "Ash Catches a Pokémon", plot: "Ash catches his first Pokemon, a Caterpie.", rating: "7.8" },
                        { title: "Challenge of the Samurai", plot: "Ash battles a samurai trainer in Viridian Forest.", rating: "7.9" }
                    ]
                }
            ]
        }
    },
    // Dragon Ball Z
    'tt0214341': {
        success: true,
        result: {
            Title: "Dragon Ball Z",
            Year: "1989",
            Rated: "TV-14",
            Released: "26 Apr 1989",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Akira Toriyama",
            Actors: "Sean Schemmel, Christopher Sabat, Stephanie Nadolny, Sonny Strait",
            Plot: "Goku and his friends defend the Earth against an assortment of villains ranging from intergalactic space fighters and conquerors to powerful androids and magical creatures.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BNmFiM2FkYTYtY2FiOS00ZWJkLTkyOTgtNmFmODI4NjcwNDgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.8/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.8",
            imdbVotes: "140,000",
            imdbID: "tt0214341",
            Type: "series",
            totalSeasons: "9",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The New Threat", plot: "A mysterious warrior arrives on Earth seeking Goku.", rating: "8.1" },
                        { title: "Reunions", plot: "Goku introduces his son Gohan to his friends.", rating: "8.2" },
                        { title: "Unlikely Alliance", plot: "Goku and Piccolo team up against Raditz.", rating: "8.4" },
                        { title: "Piccolo's Plan", plot: "Piccolo trains Gohan to unlock his hidden power.", rating: "8.3" }
                    ]
                }
            ]
        }
    },
    // Demon Slayer
    'tt9335498': {
        success: true,
        result: {
            Title: "Demon Slayer: Kimetsu no Yaiba",
            Year: "2019",
            Rated: "TV-MA",
            Released: "06 Apr 2019",
            Runtime: "24 min",
            Genre: "Animation, Action, Fantasy",
            Director: "N/A",
            Writer: "Koyoharu Gotouge",
            Actors: "Natsuki Hanae, Zach Aguilar, Abby Trott, Akari Kitō",
            Plot: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.6/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.6",
            imdbVotes: "135,000",
            imdbID: "tt9335498",
            Type: "series",
            totalSeasons: "4",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Cruelty", plot: "Tanjiro returns home to find his family slaughtered by demons.", rating: "8.9" },
                        { title: "Trainer Sakonji Urokodaki", plot: "Tanjiro begins his training to become a demon slayer.", rating: "8.5" },
                        { title: "Sabito and Makomo", plot: "Tanjiro meets two mysterious children during training.", rating: "8.6" },
                        { title: "Final Selection", plot: "Tanjiro faces the final selection exam.", rating: "8.7" }
                    ]
                }
            ]
        }
    },
    // Attack on Titan
    'tt2560140': {
        success: true,
        result: {
            Title: "Attack on Titan",
            Year: "2013",
            Rated: "TV-MA",
            Released: "07 Apr 2013",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Hajime Isayama",
            Actors: "Yuki Kaji, Marina Inoue, Josh Grelle, Bryce Papenbrook",
            Plot: "After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "9.1/10" }
            ],
            Metascore: "N/A",
            imdbRating: "9.1",
            imdbVotes: "180,000",
            imdbID: "tt2560140",
            Type: "series",
            totalSeasons: "4",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "To You, in 2000 Years", plot: "The Titans breach Wall Maria and attack Shiganshina.", rating: "9.3" },
                        { title: "That Day", plot: "Eren and Mikasa join the military to fight the Titans.", rating: "8.8" },
                        { title: "A Dim Light Amid Despair", plot: "Humanity's hope begins training.", rating: "8.7" },
                        { title: "The Night of the Closing Ceremony", plot: "The trainees prepare for their first mission.", rating: "8.6" }
                    ]
                }
            ]
        }
    },
    // Spy x Family
    'tt13706018': {
        success: true,
        result: {
            Title: "Spy x Family",
            Year: "2022",
            Rated: "TV-14",
            Released: "09 Apr 2022",
            Runtime: "24 min",
            Genre: "Animation, Action, Comedy",
            Director: "N/A",
            Writer: "Tatsuya Endo",
            Actors: "Takuya Eguchi, Atsumi Tanezaki, Saori Hayami, Alex Organ",
            Plot: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must hide their true identities from each other.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BZDkwNjc0NWEtNzJlOC00N2YwLTk4MjktZGFlZDE2Y2QzOWI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.3/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.3",
            imdbVotes: "85,000",
            imdbID: "tt13706018",
            Type: "series",
            totalSeasons: "2",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Operation Strix", plot: "Twilight is given a new mission to start a family.", rating: "8.5" },
                        { title: "Secure a Wife", plot: "Loid searches for a wife to complete his cover.", rating: "8.4" },
                        { title: "Prepare for the Interview", plot: "The Forger family prepares for the school interview.", rating: "8.6" },
                        { title: "The Prestigious School's Interview", plot: "The family faces the Eden Academy interview.", rating: "8.7" }
                    ]
                }
            ]
        }
    },
    // Boruto
    'tt6342474': {
        success: true,
        result: {
            Title: "Boruto: Naruto Next Generations",
            Year: "2017",
            Rated: "TV-14",
            Released: "05 Apr 2017",
            Runtime: "23 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Masashi Kishimoto, Ukyo Kodachi",
            Actors: "Yuko Sanpei, Kokoro Kikuchi, Ryuichi Kijima, Amanda Celine Miller",
            Plot: "Son of Naruto Uzumaki, Boruto, follows his father's footsteps along with his friends to become great ninja. Throughout all their adventures, Boruto is determined to make his mark in the ninja world and live outside of his father's shadow.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BNDgzYzNhOGUtMWI1Mi00YjJkLWI2NGItOWFlNDE4ZjE0NGExXkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "6.6/10" }
            ],
            Metascore: "N/A",
            imdbRating: "6.6",
            imdbVotes: "45,000",
            imdbID: "tt6342474",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Boruto Uzumaki!", plot: "Boruto begins his journey as a ninja.", rating: "7.5" },
                        { title: "The Hokage's Son!", plot: "Boruto struggles with living in his father's shadow.", rating: "7.3" },
                        { title: "Metal Lee Goes Wild!", plot: "Boruto's classmate Metal Lee faces his fears.", rating: "7.2" },
                        { title: "A Ninjutsu Battle of the Sexes!", plot: "The academy students compete in a challenge.", rating: "7.4" }
                    ]
                }
            ]
        }
    },
    // Death Note
    'tt0877057': {
        success: true,
        result: {
            Title: "Death Note",
            Year: "2006",
            Rated: "TV-14",
            Released: "04 Oct 2006",
            Runtime: "24 min",
            Genre: "Animation, Crime, Drama",
            Director: "N/A",
            Writer: "Tsugumi Ohba, Takeshi Obata",
            Actors: "Mamoru Miyano, Brad Swaile, Vincent Tong, Ry Nakatani",
            Plot: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.9/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.9",
            imdbVotes: "350,000",
            imdbID: "tt0877057",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Rebirth", plot: "Light Yagami finds the Death Note and tests its power.", rating: "9.2" },
                        { title: "Confrontation", plot: "L begins his investigation into Kira.", rating: "9.0" },
                        { title: "Dealings", plot: "Light meets the shinigami Ryuk.", rating: "8.9" },
                        { title: "Pursuit", plot: "L narrows down Kira's location.", rating: "9.1" }
                    ]
                }
            ]
        }
    },
    // Bleach
    'tt0434665': {
        success: true,
        result: {
            Title: "Bleach",
            Year: "2004",
            Rated: "TV-14",
            Released: "05 Oct 2004",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Tite Kubo",
            Actors: "Johnny Yong Bosch, Michelle Ruff, Stephanie Sheh, Jamieson Price",
            Plot: "High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to defend humans from evil spirits and guide departed souls to the afterlife.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BOWQwOWY5NTUtMjAyZi00YjQzLTkwODgtNmQwZjU1MGIzZDhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.2/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.2",
            imdbVotes: "120,000",
            imdbID: "tt0434665",
            Type: "series",
            totalSeasons: "16",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Day I Became a Shinigami", plot: "Ichigo meets Rukia and becomes a Soul Reaper.", rating: "8.4" },
                        { title: "The Shinigami's Work", plot: "Ichigo starts his duties as a Soul Reaper.", rating: "8.0" },
                        { title: "The Older Brother's Wish, the Younger Sister's Wish", plot: "Ichigo faces a Hollow.", rating: "7.9" },
                        { title: "Cursed Parakeet", plot: "Ichigo helps a boy with a cursed parakeet.", rating: "7.8" }
                    ]
                }
            ]
        }
    },
    // Fullmetal Alchemist: Brotherhood
    'tt1535491': {
        success: true,
        result: {
            Title: "Fullmetal Alchemist: Brotherhood",
            Year: "2009",
            Rated: "TV-14",
            Released: "05 Apr 2009",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Hiromu Arakawa",
            Actors: "Vic Mignogna, Maxey Whitehead, Travis Willingham, Caitlin Glass",
            Plot: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BMzNiODA5NjYtYWExZS00OTc4LTg3N2ItYWYwYTUyYmM5MWViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "9.1/10" }
            ],
            Metascore: "N/A",
            imdbRating: "9.1",
            imdbVotes: "200,000",
            imdbID: "tt1535491",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Fullmetal Alchemist", plot: "The Elric brothers' tragic past is revealed.", rating: "8.9" },
                        { title: "The First Day", plot: "The brothers burn their childhood home and set out.", rating: "8.8" },
                        { title: "City of Heresy", plot: "Edward and Alphonse investigate a religious cult.", rating: "8.7" },
                        { title: "An Alchemist's Anguish", plot: "The brothers face a difficult moral choice.", rating: "8.9" }
                    ]
                }
            ]
        }
    },
    // Hunter x Hunter
    'tt2098220': {
        success: true,
        result: {
            Title: "Hunter x Hunter",
            Year: "2011",
            Rated: "TV-14",
            Released: "02 Oct 2011",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Yoshihiro Togashi",
            Actors: "Megumi Han, Mariya Ise, Cristina Vee, Erica Mendez",
            Plot: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and his potential, he seeks for his father who left him when he was younger.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BYzYxOTlkYzctNGY2MC00MjNjLWIxOWMtY2QwYjcxZWIwMmEwXkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "9.0/10" }
            ],
            Metascore: "N/A",
            imdbRating: "9.0",
            imdbVotes: "165,000",
            imdbID: "tt2098220",
            Type: "series",
            totalSeasons: "6",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Departure x And x Friends", plot: "Gon leaves Whale Island to become a Hunter.", rating: "8.6" },
                        { title: "Test x of x Tests", plot: "The Hunter Exam begins with a grueling test.", rating: "8.4" },
                        { title: "Rivals x For x Survival", plot: "Gon meets Killua and other examinees.", rating: "8.5" },
                        { title: "Hope x And x Ambition", plot: "The candidates face new challenges.", rating: "8.6" }
                    ]
                }
            ]
        }
    },
    // Jujutsu Kaisen
    'tt12343534': {
        success: true,
        result: {
            Title: "Jujutsu Kaisen",
            Year: "2020",
            Rated: "TV-MA",
            Released: "03 Oct 2020",
            Runtime: "24 min",
            Genre: "Animation, Action, Fantasy",
            Director: "N/A",
            Writer: "Gege Akutami",
            Actors: "Junya Enoki, Yuma Uchida, Asami Seto, Adam McArthur",
            Plot: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BMjBlNTExMDAtMWZjZi00MDc5LWFkMjgtZDU0ZWQ5ODk3YWY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.5/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.5",
            imdbVotes: "110,000",
            imdbID: "tt12343534",
            Type: "series",
            totalSeasons: "2",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Ryomen Sukuna", plot: "Yuji eats the cursed finger and becomes Sukuna's vessel.", rating: "8.8" },
                        { title: "For Myself", plot: "Yuji faces his execution but is given a chance.", rating: "8.6" },
                        { title: "Girl of Steel", plot: "Yuji and Megumi investigate a cursed womb.", rating: "8.7" },
                        { title: "Curse Womb Must Die", plot: "The trio faces a special grade curse.", rating: "9.0" }
                    ]
                }
            ]
        }
    },
    // Solo Leveling
    'tt21209876': {
        success: true,
        result: {
            Title: "Solo Leveling",
            Year: "2024",
            Rated: "TV-MA",
            Released: "07 Jan 2024",
            Runtime: "24 min",
            Genre: "Animation, Action, Fantasy",
            Director: "N/A",
            Writer: "Chugong",
            Actors: "Taito Ban, Genta Nakamura, Haruna Mikawa, Aleks Le",
            Plot: "In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect mankind, Sung Jin-Woo, a notoriously weak hunter, finds himself in a seemingly endless struggle for survival.",
            Language: "Japanese, English",
            Country: "Japan, South Korea",
            Awards: "N/A",
            Poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjjydKUpH1rz3V2N2oTcKX7O3QIMkH_-xqqw&s",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.4/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.4",
            imdbVotes: "75,000",
            imdbID: "tt21209876",
            Type: "series",
            totalSeasons: "1",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "I'm Used to It", plot: "Jin-Woo enters a double dungeon and faces death.", rating: "8.5" },
                        { title: "If I Had One More Chance", plot: "Jin-Woo accepts the system and begins leveling up.", rating: "8.9" },
                        { title: "It's Like a Game", plot: "Jin-Woo discovers his new powers.", rating: "8.7" },
                        { title: "I've Gotta Get Stronger", plot: "Jin-Woo trains to become stronger.", rating: "8.6" }
                    ]
                }
            ]
        }
    },
    // Sailor Moon
    'tt0103524': {
        success: true,
        result: {
            Title: "Sailor Moon",
            Year: "1992",
            Rated: "TV-PG",
            Released: "07 Mar 1992",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Naoko Takeuchi",
            Actors: "Kotono Mitsuishi, Kae Araki, Aya Hisakawa",
            Plot: "Usagi Tsukino is a clumsy but kindhearted teenager who transforms into the powerful guardian of love and justice, Sailor Moon.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BNDBhMGE3ZjAtM2VlYi00ZDVhLThiNDgtNTIxNzY5NjJmYWUyXkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.7/10" }
            ],
            Metascore: "N/A",
            imdbRating: "7.7",
            imdbVotes: "25,000",
            imdbID: "tt0103524",
            Type: "series",
            totalSeasons: "5",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Crybaby: Usagi's Beautiful Transformation", plot: "Usagi becomes Sailor Moon.", rating: "7.8" },
                        { title: "Punishment Awaits: The House of Fortune is the Monster Mansion", plot: "Usagi investigates a fortune teller.", rating: "7.5" },
                        { title: "The Mysterious Sleeping Sickness: Protect the Girls' Hearts in Love", plot: "A radio show drains energy.", rating: "7.6" },
                        { title: "Learn How to be Skinny from Usagi", plot: "Usagi joins a gym that is a trap.", rating: "7.4" }
                    ]
                }
            ]
        }
    },
    // My Hero Academia
    'tt5626028': {
        success: true,
        result: {
            Title: "My Hero Academia",
            Year: "2016",
            Rated: "TV-14",
            Released: "03 Apr 2016",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Kohei Horikoshi",
            Actors: "Daiki Yamashita, Nobuhiko Okamoto, Kenta Miyake",
            Plot: "A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.3/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.3",
            imdbVotes: "85,000",
            imdbID: "tt5626028",
            Type: "series",
            totalSeasons: "6",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "Izuku Midoriya: Origin", plot: "Izuku meets All Might.", rating: "8.6" },
                        { title: "What It Takes to Be a Hero", plot: "Izuku proves his worth.", rating: "8.8" },
                        { title: "Roaring Muscles", plot: "Izuku receives One For All.", rating: "8.5" },
                        { title: "Start Line", plot: "The entrance exam begins.", rating: "8.7" }
                    ]
                }
            ]
        }
    },
    // Sword Art Online
    'tt2250192': {
        success: true,
        result: {
            Title: "Sword Art Online",
            Year: "2012",
            Rated: "TV-14",
            Released: "08 Jul 2012",
            Runtime: "24 min",
            Genre: "Animation, Action, Adventure",
            Director: "N/A",
            Writer: "Reki Kawahara",
            Actors: "Yoshitsugu Matsuoka, Haruka Tomatsu, Bryce Papenbrook",
            Plot: "Players of a virtual reality MMORPG get trapped inside the game, where dying in the game means dying in the real world.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BN2NhYzU2NDEtYzI1NS00MjgzLThjZGUtOTYxNGJkZjZmNDdjXkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "7.5/10" }
            ],
            Metascore: "N/A",
            imdbRating: "7.5",
            imdbVotes: "60,000",
            imdbID: "tt2250192",
            Type: "series",
            totalSeasons: "4",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The World of Swords", plot: "Kirito logs into SAO and gets trapped.", rating: "8.2" },
                        { title: "Beater", plot: "Kirito defeats the first boss and reveals his skill.", rating: "8.4" },
                        { title: "The Red-Nosed Reindeer", plot: "Kirito joins a guild with tragic results.", rating: "8.8" },
                        { title: "The Black Swordsman", plot: "Kirito helps a beast tamer.", rating: "8.1" }
                    ]
                }
            ]
        }
    },
    // One-Punch Man
    'tt4508902': {
        success: true,
        result: {
            Title: "One-Punch Man",
            Year: "2015",
            Rated: "TV-14",
            Released: "05 Oct 2015",
            Runtime: "24 min",
            Genre: "Animation, Action, Comedy",
            Director: "N/A",
            Writer: "ONE",
            Actors: "Makoto Furukawa, Kaito Ishikawa, Max Mittelman",
            Plot: "The story of Saitama, a hero that does it just for fun & can defeat his enemies with a single punch.",
            Language: "Japanese, English",
            Country: "Japan",
            Awards: "N/A",
            Poster: "https://m.media-amazon.com/images/M/MV5BNzMwOGQ5MWItNzE3My00ZDYyLTk4NzAtZWIyYWI0NTZhYzY0XkEyXkFqcGc@._V1_.jpg",
            Ratings: [
                { Source: "Internet Movie Database", Value: "8.7/10" }
            ],
            Metascore: "N/A",
            imdbRating: "8.7",
            imdbVotes: "150,000",
            imdbID: "tt4508902",
            Type: "series",
            totalSeasons: "2",
            Seasons: [
                {
                    seasonNumber: 1,
                    episodes: [
                        { title: "The Strongest Man", plot: "Saitama introduces himself and his power.", rating: "8.5" },
                        { title: "The Lone Cyborg", plot: "Genos meets Saitama and asks to be his disciple.", rating: "8.7" },
                        { title: "The Obsessive Scientist", plot: "Saitama and Genos attack the House of Evolution.", rating: "8.6" },
                        { title: "The Modern Ninja", plot: "Saitama fights a ninja named Speed-o'-Sound Sonic.", rating: "8.4" }
                    ]
                }
            ]
        }
    },
    // Hero Movies
    // Black Adam
    'tt6443346': {
        success: true,
        result: {
            Title: "Black Adam",
            Year: "2022",
            Rated: "PG-13",
            Released: "21 Oct 2022",
            Runtime: "2h 5m",
            Genre: "Action, Adventure, Fantasy",
            Director: "Jaume Collet-Serra",
            Writer: "Adam Sztykiel, Rory Haines, Sohrab Noshirvani",
            Actors: "Dwayne Johnson, Aldis Hodge, Pierce Brosnan",
            Plot: "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://4kwallpapers.com/images/walls/thumbs_3t/8727.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "6.3/10" }],
            Metascore: "41",
            imdbRating: "6.3",
            imdbVotes: "250,000",
            imdbID: "tt6443346",
            Type: "movie",
            BoxOffice: "$393,252,111",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // Top Gun: Maverick
    'tt1745960': {
        success: true,
        result: {
            Title: "Top Gun: Maverick",
            Year: "2022",
            Rated: "PG-13",
            Released: "27 May 2022",
            Runtime: "2h 10m",
            Genre: "Action, Drama",
            Director: "Joseph Kosinski",
            Writer: "Jim Cash, Jack Epps Jr., Peter Craig",
            Actors: "Tom Cruise, Jennifer Connelly, Miles Teller",
            Plot: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
            Language: "English",
            Country: "USA",
            Awards: "Won 1 Oscar",
            Poster: "https://m.media-amazon.com/images/I/71BokibfVUL._SL1500_.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.3/10" }],
            Metascore: "78",
            imdbRating: "8.3",
            imdbVotes: "600,000",
            imdbID: "tt1745960",
            Type: "movie",
            BoxOffice: "$1,495,696,292",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // Avatar: The Way of Water
    'tt1630029': {
        success: true,
        result: {
            Title: "Avatar: The Way of Water",
            Year: "2022",
            Rated: "PG-13",
            Released: "16 Dec 2022",
            Runtime: "3h 12m",
            Genre: "Action, Adventure, Fantasy",
            Director: "James Cameron",
            Writer: "James Cameron, Rick Jaffa, Amanda Silver",
            Actors: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
            Plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
            Language: "English",
            Country: "USA",
            Awards: "Won 1 Oscar",
            Poster: "https://images.wallpapersden.com/image/download/avatar-the-way-of-water-poster_bW1mZ2qUmZqaraWkpJRoZW1urWZoams.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "7.6/10" }],
            Metascore: "67",
            imdbRating: "7.6",
            imdbVotes: "400,000",
            imdbID: "tt1630029",
            Type: "movie",
            BoxOffice: "$2,320,250,281",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // Avengers: Endgame
    'tt4154796': {
        success: true,
        result: {
            Title: "Avengers: Endgame",
            Year: "2019",
            Rated: "PG-13",
            Released: "26 Apr 2019",
            Runtime: "3h 1m",
            Genre: "Action, Adventure, Drama",
            Director: "Anthony Russo, Joe Russo",
            Writer: "Christopher Markus, Stephen McFeely",
            Actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
            Plot: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
            Language: "English, Japanese, Xhosa",
            Country: "USA",
            Awards: "Nominated for 1 Oscar",
            Poster: "https://image.tmdb.org/t/p/original/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.4/10" }],
            Metascore: "78",
            imdbRating: "8.4",
            imdbVotes: "1,200,000",
            imdbID: "tt4154796",
            Type: "movie",
            BoxOffice: "$2,797,501,328",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // The Lord of the Rings: The Return of the King
    'tt0167260': {
        success: true,
        result: {
            Title: "The Lord of the Rings: The Return of the King",
            Year: "2003",
            Rated: "PG-13",
            Released: "17 Dec 2003",
            Runtime: "3h 21m",
            Genre: "Action, Adventure, Drama",
            Director: "Peter Jackson",
            Writer: "J.R.R. Tolkien, Fran Walsh, Philippa Boyens",
            Actors: "Elijah Wood, Viggo Mortensen, Ian McKellen",
            Plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            Language: "English, Quenya, Old English, Sindarin",
            Country: "New Zealand, USA",
            Awards: "Won 11 Oscars",
            Poster: "https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "9.0/10" }],
            Metascore: "94",
            imdbRating: "9.0",
            imdbVotes: "1,900,000",
            imdbID: "tt0167260",
            Type: "movie",
            BoxOffice: "$1,146,030,912",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // Star Wars: Episode IV - A New Hope
    'tt0076759': {
        success: true,
        result: {
            Title: "Star Wars: Episode IV - A New Hope",
            Year: "1977",
            Rated: "PG",
            Released: "25 May 1977",
            Runtime: "2h 1m",
            Genre: "Action, Adventure, Fantasy",
            Director: "George Lucas",
            Writer: "George Lucas",
            Actors: "Mark Hamill, Harrison Ford, Carrie Fisher",
            Plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
            Language: "English",
            Country: "USA",
            Awards: "Won 6 Oscars",
            Poster: "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.6/10" }],
            Metascore: "90",
            imdbRating: "8.6",
            imdbVotes: "1,400,000",
            imdbID: "tt0076759",
            Type: "movie",
            BoxOffice: "$775,398,007",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // TV Shows
    // Game of Thrones
    'tt0944947': {
        success: true,
        result: {
            Title: "Game of Thrones",
            Year: "2011",
            Rated: "TV-MA",
            Released: "17 Apr 2011",
            Runtime: "57 min",
            Genre: "Action, Adventure, Drama",
            Director: "N/A",
            Writer: "David Benioff, D.B. Weiss",
            Actors: "Emilia Clarke, Peter Dinklage, Kit Harington",
            Plot: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
            Language: "English",
            Country: "USA, UK",
            Awards: "Won 59 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "9.2/10" }],
            Metascore: "N/A",
            imdbRating: "9.2",
            imdbVotes: "2,200,000",
            imdbID: "tt0944947",
            Type: "series",
            totalSeasons: "8",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Winter Is Coming", plot: "Ned Stark is asked to be the Hand of the King.", rating: "9.1" }] }]
        }
    },
    // Breaking Bad
    'tt0903747': {
        success: true,
        result: {
            Title: "Breaking Bad",
            Year: "2008",
            Rated: "TV-MA",
            Released: "20 Jan 2008",
            Runtime: "49 min",
            Genre: "Crime, Drama, Thriller",
            Director: "N/A",
            Writer: "Vince Gilligan",
            Actors: "Bryan Cranston, Aaron Paul, Anna Gunn",
            Plot: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
            Language: "English",
            Country: "USA",
            Awards: "Won 16 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "9.5/10" }],
            Metascore: "87",
            imdbRating: "9.5",
            imdbVotes: "2,000,000",
            imdbID: "tt0903747",
            Type: "series",
            totalSeasons: "5",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Pilot", plot: "Walter White is diagnosed with cancer.", rating: "9.0" }] }]
        }
    },
    // Stranger Things
    'tt4574334': {
        success: true,
        result: {
            Title: "Stranger Things",
            Year: "2016",
            Rated: "TV-14",
            Released: "15 Jul 2016",
            Runtime: "51 min",
            Genre: "Drama, Fantasy, Horror",
            Director: "N/A",
            Writer: "Matt Duffer, Ross Duffer",
            Actors: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder",
            Plot: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
            Language: "English",
            Country: "USA",
            Awards: "Won 12 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.7/10" }],
            Metascore: "N/A",
            imdbRating: "8.7",
            imdbVotes: "1,250,000",
            imdbID: "tt4574334",
            Type: "series",
            totalSeasons: "4",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "The Vanishing of Will Byers", plot: "A young boy goes missing.", rating: "8.6" }] }]
        }
    },
    // The Walking Dead
    'tt1520211': {
        success: true,
        result: {
            Title: "The Walking Dead",
            Year: "2010",
            Rated: "TV-MA",
            Released: "31 Oct 2010",
            Runtime: "44 min",
            Genre: "Drama, Horror, Thriller",
            Director: "N/A",
            Writer: "Frank Darabont",
            Actors: "Andrew Lincoln, Norman Reedus, Melissa McBride",
            Plot: "Sheriff Deputy Rick Grimes wakes up from a coma to learn the world is in ruins and must lead a group of survivors to stay alive.",
            Language: "English",
            Country: "USA",
            Awards: "Won 2 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.1/10" }],
            Metascore: "N/A",
            imdbRating: "8.1",
            imdbVotes: "1,050,000",
            imdbID: "tt1520211",
            Type: "series",
            totalSeasons: "11",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Days Gone Bye", plot: "Rick searches for his family.", rating: "9.2" }] }]
        }
    },
    // Friends
    'tt0108778': {
        success: true,
        result: {
            Title: "Friends",
            Year: "1994",
            Rated: "TV-14",
            Released: "22 Sep 1994",
            Runtime: "22 min",
            Genre: "Comedy, Romance",
            Director: "N/A",
            Writer: "David Crane, Marta Kauffman",
            Actors: "Jennifer Aniston, Courteney Cox, Lisa Kudrow",
            Plot: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
            Language: "English",
            Country: "USA",
            Awards: "Won 6 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.9/10" }],
            Metascore: "N/A",
            imdbRating: "8.9",
            imdbVotes: "1,000,000",
            imdbID: "tt0108778",
            Type: "series",
            totalSeasons: "10",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "The One Where Monica Gets a Roommate", plot: "Rachel leaves Barry at the altar.", rating: "8.3" }] }]
        }
    },
    // Squid Game
    'tt10919420': {
        success: true,
        result: {
            Title: "Squid Game",
            Year: "2021",
            Rated: "TV-MA",
            Released: "17 Sep 2021",
            Runtime: "55 min",
            Genre: "Action, Drama, Mystery",
            Director: "N/A",
            Writer: "Hwang Dong-hyuk",
            Actors: "Lee Jung-jae, Park Hae-soo, Wi Ha-joon",
            Plot: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
            Language: "Korean, English",
            Country: "South Korea",
            Awards: "Won 6 Emmys",
            Poster: "https://image.tmdb.org/t/p/original/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.0/10" }],
            Metascore: "N/A",
            imdbRating: "8.0",
            imdbVotes: "500,000",
            imdbID: "tt10919420",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Red Light, Green Light", plot: "The game begins.", rating: "8.4" }] }]
        }
    },
    // Pluribus (Custom)
    'tt_pluribus': {
        success: true,
        result: {
            Title: "Pluribus",
            Year: "2025",
            Rated: "TV-14",
            Released: "01 Jan 2025",
            Runtime: "45 min",
            Genre: "Sci-Fi, Thriller",
            Director: "N/A",
            Writer: "N/A",
            Actors: "N/A",
            Plot: "A near-future thriller where humanity interacts with an advanced AI system named Pluribus.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://www.themoviedb.org/t/p/w1280/nrM2xFUfKJJEmZzd5d7kohT2G0C.jpg",
            Ratings: [],
            Metascore: "N/A",
            imdbRating: "8.5",
            imdbVotes: "10,000",
            imdbID: "tt_pluribus",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Initialization", plot: "The system comes online.", rating: "8.5" }] }]
        }
    },
    // Heated Rivalry (Custom)
    'tt_heated': {
        success: true,
        result: {
            Title: "Heated Rivalry",
            Year: "2025",
            Rated: "TV-MA",
            Released: "14 Feb 2025",
            Runtime: "42 min",
            Genre: "Drama, Romance, Sport",
            Director: "N/A",
            Writer: "N/A",
            Actors: "N/A",
            Plot: "Two rival hockey players find themselves in a heated romance that threatens their careers.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://www.themoviedb.org/t/p/w1280/epgr7n61vVIniyAghz2GYj22DkC.jpg",
            Ratings: [],
            Metascore: "N/A",
            imdbRating: "8.8",
            imdbVotes: "5,000",
            imdbID: "tt_heated",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Face Off", plot: "The rivalry begins on ice.", rating: "8.8" }] }]
        }
    },
    // Fallout
    'tt12637874': {
        success: true,
        result: {
            Title: "Fallout",
            Year: "2024",
            Rated: "TV-MA",
            Released: "12 Apr 2024",
            Runtime: "1h",
            Genre: "Action, Adventure, Drama",
            Director: "N/A",
            Writer: "Geneva Robertson-Dworet, Graham Wagner",
            Actors: "Ella Purnell, Aaron Moten, Walton Goggins",
            Plot: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://media.themoviedb.org/t/p/original/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.4/10" }],
            Metascore: "73",
            imdbRating: "8.4",
            imdbVotes: "150,000",
            imdbID: "tt12637874",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "The End", plot: "The bombs drop.", rating: "8.6" }] }]
        }
    },
    // IT: Welcome to Derry (Custom/Upcoming)
    'tt22061614': {
        success: true,
        result: {
            Title: "IT: Welcome to Derry",
            Year: "2025",
            Rated: "TV-MA",
            Released: "2025",
            Runtime: "50 min",
            Genre: "Horror, Mystery",
            Director: "N/A",
            Writer: "N/A",
            Actors: "Taylour Paige, Jovan Adepo, Chris Chalk",
            Plot: "Set in the world of Stephen King's IT universe, Welcome to Derry is based on King's It novel and expands the vision.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://www.themoviedb.org/t/p/w1280/nyy3BITeIjviv6PFIXtqvc8i6xi.jpg",
            Ratings: [],
            Metascore: "N/A",
            imdbRating: "8.2",
            imdbVotes: "2,000",
            imdbID: "tt22061614",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Chapter One", plot: "Derry's dark history begins.", rating: "8.2" }] }]
        }
    },
    // Landman (Custom/Upcoming)
    'tt_landman': {
        success: true,
        result: {
            Title: "Landman",
            Year: "2024",
            Rated: "TV-MA",
            Released: "2024",
            Runtime: "45 min",
            Genre: "Drama",
            Director: "N/A",
            Writer: "Taylor Sheridan",
            Actors: "Billy Bob Thornton, Jon Hamm, Demi Moore",
            Plot: "Set in the proverbial boomtowns of West Texas, Landman is a modern-day tale of fortune-seeking in the world of oil rigs.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://www.themoviedb.org/t/p/w1280/hYthRgS1nvQkGILn9YmqsF8kSk6.jpg",
            Ratings: [],
            Metascore: "N/A",
            imdbRating: "7.8",
            imdbVotes: "1,000",
            imdbID: "tt_landman",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Boom", plot: "The oil boom begins.", rating: "7.8" }] }]
        }
    },
    // Severance
    'tt11280740': {
        success: true,
        result: {
            Title: "Severance",
            Year: "2022",
            Rated: "TV-MA",
            Released: "18 Feb 2022",
            Runtime: "50 min",
            Genre: "Drama, Mystery, Sci-Fi",
            Director: "Ben Stiller",
            Writer: "Dan Erickson",
            Actors: "Adam Scott, Zach Cherry, Britt Lower",
            Plot: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
            Language: "English",
            Country: "USA",
            Awards: "Won 2 Emmys",
            Poster: "https://media.themoviedb.org/t/p/original/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.7/10" }],
            Metascore: "83",
            imdbRating: "8.7",
            imdbVotes: "180,000",
            imdbID: "tt11280740",
            Type: "series",
            totalSeasons: "1",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Good News About Hell", plot: "Mark is promoted to lead the team.", rating: "8.5" }] }]
        }
    },
    // Fargo
    'tt2802850': {
        success: true,
        result: {
            Title: "Fargo",
            Year: "2014",
            Rated: "TV-MA",
            Released: "15 Apr 2014",
            Runtime: "53 min",
            Genre: "Crime, Drama, Thriller",
            Director: "N/A",
            Writer: "Noah Hawley",
            Actors: "Billy Bob Thornton, Martin Freeman, Allison Tolman",
            Plot: "Various chronicles of deception, intrigue and murder in and around frozen Minnesota.",
            Language: "English",
            Country: "USA",
            Awards: "Won 6 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/6U9CPeD8obHzweikFhiLhpc7YBT.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.9/10" }],
            Metascore: "85",
            imdbRating: "8.9",
            imdbVotes: "380,000",
            imdbID: "tt2802850",
            Type: "series",
            totalSeasons: "5",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "The Crocodile's Dilemma", plot: "A drifter named Lorne Malvo arrives in Bemidji, Minnesota.", rating: "9.2" }] }]
        }
    },
    // Grey's Anatomy
    'tt0413573': {
        success: true,
        result: {
            Title: "Grey's Anatomy",
            Year: "2005",
            Rated: "TV-14",
            Released: "27 Mar 2005",
            Runtime: "41 min",
            Genre: "Drama, Romance",
            Director: "N/A",
            Writer: "Shonda Rhimes",
            Actors: "Ellen Pompeo, Chandra Wilson, James Pickens Jr.",
            Plot: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.",
            Language: "English",
            Country: "USA",
            Awards: "Won 4 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/hjJkrLXhWvGHpLeLBDFznpBTY1S.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "7.6/10" }],
            Metascore: "64",
            imdbRating: "7.6",
            imdbVotes: "330,000",
            imdbID: "tt0413573",
            Type: "series",
            totalSeasons: "19",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "A Hard Day's Night", plot: "Interns start their first shift.", rating: "8.2" }] }]
        }
    },
    // Orange Is the New Black
    'tt2372162': {
        success: true,
        result: {
            Title: "Orange Is the New Black",
            Year: "2013",
            Rated: "TV-MA",
            Released: "11 Jul 2013",
            Runtime: "59 min",
            Genre: "Comedy, Crime, Drama",
            Director: "N/A",
            Writer: "Jenji Kohan",
            Actors: "Taylor Schilling, Danielle Brooks, Taryn Manning",
            Plot: "Convicted of a decade old crime of transporting drug money to an ex-girlfriend, normally law-abiding Piper Chapman is sentenced to a year and a half behind bars.",
            Language: "English",
            Country: "USA",
            Awards: "Won 4 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/ekaa7YjGPTkFLcPhwWXTnARuCEU.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.0/10" }],
            Metascore: "79",
            imdbRating: "8.0",
            imdbVotes: "300,000",
            imdbID: "tt2372162",
            Type: "series",
            totalSeasons: "7",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "I Wasn't Ready", plot: "Piper surrenders herself to prison.", rating: "8.3" }] }]
        }
    },
    // Riverdale
    'tt5421782': {
        success: true,
        result: {
            Title: "Riverdale",
            Year: "2017",
            Rated: "TV-14",
            Released: "26 Jan 2017",
            Runtime: "45 min",
            Genre: "Crime, Drama, Mystery",
            Director: "N/A",
            Writer: "Roberto Aguirre-Sacasa",
            Actors: "Lili Reinhart, Camila Mendes, Cole Sprouse",
            Plot: "While navigating the troubled waters of romance, school and family, Archie and his gang become entangled in dark Riverdale mysteries.",
            Language: "English",
            Country: "USA",
            Awards: "N/A",
            Poster: "https://www.themoviedb.org/t/p/w1280/d8mmn9thQ5dBk2qbv6BCqGUXWK3.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "6.5/10" }],
            Metascore: "68",
            imdbRating: "6.5",
            imdbVotes: "150,000",
            imdbID: "tt5421782",
            Type: "series",
            totalSeasons: "7",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Chapter One: The River's Edge", plot: "The town reels from Jason Blossom's death.", rating: "7.8" }] }]
        }
    },
    // How I Met Your Mother
    'tt0460649': {
        success: true,
        result: {
            Title: "How I Met Your Mother",
            Year: "2005",
            Rated: "TV-14",
            Released: "19 Sep 2005",
            Runtime: "22 min",
            Genre: "Comedy, Romance",
            Director: "N/A",
            Writer: "Carter Bays, Craig Thomas",
            Actors: "Josh Radnor, Jason Segel, Cobie Smulders",
            Plot: "A father recounts to his children - through a series of flashbacks - the journey he and his four best friends took leading up to him meeting their mother.",
            Language: "English",
            Country: "USA",
            Awards: "Won 10 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.3/10" }],
            Metascore: "N/A",
            imdbRating: "8.3",
            imdbVotes: "700,000",
            imdbID: "tt0460649",
            Type: "series",
            totalSeasons: "9",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Pilot", plot: "Ted falls for Robin.", rating: "8.5" }] }]
        }
    },
    // Black Mirror
    'tt2085059': {
        success: true,
        result: {
            Title: "Black Mirror",
            Year: "2011",
            Rated: "TV-MA",
            Released: "04 Dec 2011",
            Runtime: "1h",
            Genre: "Drama, Mystery, Sci-Fi",
            Director: "N/A",
            Writer: "Charlie Brooker",
            Actors: "Daniel Lapaine, Hannah John-Kamen, Michaela Coel",
            Plot: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
            Language: "English",
            Country: "UK",
            Awards: "Won 6 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.8/10" }],
            Metascore: "N/A",
            imdbRating: "8.8",
            imdbVotes: "600,000",
            imdbID: "tt2085059",
            Type: "series",
            totalSeasons: "6",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "The National Anthem", plot: "Prime Minister Michael Callow faces a shocking dilemma.", rating: "7.7" }] }]
        }
    },
    // The Mandalorian
    'tt8111088': {
        success: true,
        result: {
            Title: "The Mandalorian",
            Year: "2019",
            Rated: "TV-14",
            Released: "12 Nov 2019",
            Runtime: "40 min",
            Genre: "Action, Adventure, Fantasy",
            Director: "N/A",
            Writer: "Jon Favreau",
            Actors: "Pedro Pascal, Carl Weathers, Barry Lowin",
            Plot: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
            Language: "English",
            Country: "USA",
            Awards: "Won 14 Emmys",
            Poster: "https://media.themoviedb.org/t/p/original/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.7/10" }],
            Metascore: "71",
            imdbRating: "8.7",
            imdbVotes: "550,000",
            imdbID: "tt8111088",
            Type: "series",
            totalSeasons: "3",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Chapter 1: The Mandalorian", plot: "A Mandalorian bounty hunter accepts a mysterious client.", rating: "8.7" }] }]
        }
    },
    // Peaky Blinders
    'tt2442560': {
        success: true,
        result: {
            Title: "Peaky Blinders",
            Year: "2013",
            Rated: "TV-MA",
            Released: "12 Sep 2013",
            Runtime: "1h",
            Genre: "Crime, Drama",
            Director: "N/A",
            Writer: "Steven Knight",
            Actors: "Cillian Murphy, Paul Anderson, Sophie Rundle",
            Plot: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
            Language: "English",
            Country: "UK",
            Awards: "Won 1 BAFTA",
            Poster: "https://media.themoviedb.org/t/p/original/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.8/10" }],
            Metascore: "N/A",
            imdbRating: "8.8",
            imdbVotes: "600,000",
            imdbID: "tt2442560",
            Type: "series",
            totalSeasons: "6",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Episode 1.1", plot: "Thomas Shelby prepares to fix a horse race.", rating: "8.1" }] }]
        }
    },
    // Homeland
    'tt1796960': {
        success: true,
        result: {
            Title: "Homeland",
            Year: "2011",
            Rated: "TV-MA",
            Released: "02 Oct 2011",
            Runtime: "55 min",
            Genre: "Crime, Drama, Mystery",
            Director: "N/A",
            Writer: "Alex Gansa, Howard Gordon",
            Actors: "Claire Danes, Mandy Patinkin, Damian Lewis",
            Plot: "A bipolar CIA operative becomes convinced a prisoner of war has been turned by al-Qaeda and is planning to carry out a terrorist attack on American soil.",
            Language: "English",
            Country: "USA",
            Awards: "Won 8 Emmys",
            Poster: "https://www.themoviedb.org/t/p/w1280/6GAvS2e6VIRsms9FpVt33PsCoEW.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.3/10" }],
            Metascore: "92",
            imdbRating: "8.3",
            imdbVotes: "350,000",
            imdbID: "tt1796960",
            Type: "series",
            totalSeasons: "8",
            Seasons: [{ seasonNumber: 1, episodes: [{ title: "Pilot", plot: "Carrie Mathison believes a rescued POW is a terrorist spy.", rating: "8.3" }] }]
        }
    },
    // Movies Page Classics
    // E.T. the Extra-Terrestrial
    'tt0083866': {
        success: true,
        result: {
            Title: "E.T. the Extra-Terrestrial",
            Year: "1982",
            Rated: "PG",
            Released: "11 Jun 1982",
            Runtime: "1h 55m",
            Genre: "Family, Sci-Fi",
            Director: "Steven Spielberg",
            Writer: "Melissa Mathison",
            Actors: "Henry Thomas, Drew Barrymore, Peter Coyote",
            Plot: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.",
            Language: "English",
            Country: "USA",
            Awards: "Won 4 Oscars",
            Poster: "https://image.tmdb.org/t/p/original/an0nD6uq6byfxXCfk6lQBzdL2J1.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "7.9/10" }],
            Metascore: "91",
            imdbRating: "7.9",
            imdbVotes: "400,000",
            imdbID: "tt0083866",
            Type: "movie",
            BoxOffice: "$435,110,554",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    },
    // The Wizard of Oz
    'tt0032138': {
        success: true,
        result: {
            Title: "The Wizard of Oz",
            Year: "1939",
            Rated: "G",
            Released: "25 Aug 1939",
            Runtime: "1h 42m",
            Genre: "Adventure, Family, Fantasy",
            Director: "Victor Fleming",
            Writer: "Noel Langley, Florence Ryerson, Edgar Allan Woolf",
            Actors: "Judy Garland, Frank Morgan, Ray Bolger",
            Plot: "Dorothy Gale is swept away from a farm in Kansas to a magical land of Oz in a tornado and embarks on a quest with her new friends to see the Wizard who can help her return home.",
            Language: "English",
            Country: "USA",
            Awards: "Won 2 Oscars",
            Poster: "https://m.media-amazon.com/images/M/MV5BNjUyMTc4MDExMV5BMl5BanBnXkFtZTgwNDg0NDIwMjE@._V1_.jpg",
            Ratings: [{ Source: "Internet Movie Database", Value: "8.1/10" }],
            Metascore: "92",
            imdbRating: "8.1",
            imdbVotes: "400,000",
            imdbID: "tt0032138",
            Type: "movie",
            BoxOffice: "$22,342,633",
            Production: "N/A",
            Website: "N/A",
            Response: "True"
        }
    }
};

// Mock search results
export const mockSearchResults = {
    'inception': {
        success: true,
        result: [
            {
                Title: "Inception",
                Year: "2010",
                imdbID: "tt1375666",
                Type: "movie",
                Poster: "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
            },
            {
                Title: "Inception: The Cobol Job",
                Year: "2010",
                imdbID: "tt5295894",
                Type: "movie",
                Poster: "https://via.placeholder.com/300x450?text=Inception+Cobol"
            }
        ]
    },
    'titanic': {
        success: true,
        result: [
            {
                Title: "Titanic",
                Year: "1997",
                imdbID: "tt0120338",
                Type: "movie",
                Poster: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"
            }
        ]
    },
    'avatar': {
        success: true,
        result: [
            {
                Title: "Avatar",
                Year: "2009",
                imdbID: "tt0499549",
                Type: "movie",
                Poster: "https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg"
            },
            {
                Title: "Avatar: The Way of Water",
                Year: "2022",
                imdbID: "tt1630029",
                Type: "movie",
                Poster: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
            }
        ]
    }
};
