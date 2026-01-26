
import { Continent } from '../types';

// Curated list of high-quality reliable images for activities
const ACTIVITY_IMAGES = {
  explore: [
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b", // Hiking
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", // Road trip
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", // Mountains
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4", // Camping
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b", // Range
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836", // Spread
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", // Fine dining
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", // BBQ
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601", // Pasta
    "https://images.unsplash.com/photo-1559339352-11d035aa65de", // Street food
  ],
  photo: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", // Camera
    "https://images.unsplash.com/photo-1452587925706-56ad69753ef5", // Lens
    "https://images.unsplash.com/photo-1492691523567-62d920179d47", // Landscape
    "https://images.unsplash.com/photo-1542038784456-1ea0e93ca64b", // Smartphone
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553", // Action
  ],
  sunset: [
    "https://images.unsplash.com/photo-1472120435266-53113306b2a2", // Mountains
    "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869", // Orange sky
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Beach
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8", // Field
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9", // Sea
  ]
};

const getRandomImage = (type: 'explore' | 'food' | 'photo' | 'sunset') => {
  const images = ACTIVITY_IMAGES[type];
  return images[Math.floor(Math.random() * images.length)] + "?auto=format&fit=crop&w=800&q=80";
};

const generateThingsToDo = (hotspotName: string) => [
  { name: `Explore ${hotspotName}`, description: `Discover the rich history and breathtaking views of ${hotspotName}. A must-see for any traveler.`, image: "https://img.jakpost.net/c/2016/08/02/2016_08_02_9267_1470132061._large.jpg" },
  { name: 'Local Cuisine Tour', description: `Savor the unique flavors of the region with a guided food tour near ${hotspotName}.`, image: getRandomImage('food') },
  { name: 'Photography Workshop', description: `Capture the beauty of ${hotspotName} with a professional photography workshop.`, image: getRandomImage('photo') },
  { name: 'Sunset Viewing', description: `Experience an unforgettable sunset over ${hotspotName}. The colors are simply magical.`, image: "https://img.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_74190-1075.jpg?semt=ais_hybrid&w=740&q=80" },
];

export const destinations: Continent[] = [
  {
    name: "North America",
    categories: [
      {
        name: "Iconic Landmarks & Cities",
        hotspots: [
          { name: "Statue of Liberty", country: "USA", region: "New York", city: "New York City", image: "https://images.unsplash.com/photo-1720934139830-3c0d9ee222a5?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Statue of Liberty"), lat: 40.6892, lon: -74.0445 },
          { name: "Golden Gate Bridge", country: "USA", region: "California", city: "San Francisco", image: "https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Golden Gate Bridge"), lat: 37.8199, lon: -122.4783 },
          { name: "Niagara Falls", country: "Canada/USA", region: "Ontario/New York", city: "Niagara Falls", image: "https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Niagara Falls"), lat: 43.0828, lon: -79.0742 },
          { name: "Chichen Itza", country: "Mexico", region: "Yucatán", city: "Tinum", image: "https://images.unsplash.com/photo-1620636607286-087f5a7b5716?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Chichen Itza"), lat: 20.6843, lon: -88.5678 },
          { name: "New York City", country: "USA", region: "New York", city: "New York City", image: "https://images.unsplash.com/photo-1476837754190-8036496cea40?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("New York City"), lat: 40.7128, lon: -74.0060 },
        ],
      },
      {
        name: "Natural Wonders",
        hotspots: [
          { name: "Grand Canyon National Park", country: "USA", region: "Arizona", city: "Grand Canyon Village", image: "https://images.unsplash.com/photo-1456425712190-0dd8c2b00156?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Grand Canyon"), lat: 36.1069, lon: -112.1129 },
          { name: "Yellowstone National Park", country: "USA", region: "Wyoming", city: "Yellowstone", image: "https://plus.unsplash.com/premium_photo-1694475648285-aefab04c1a77?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Yellowstone"), lat: 44.4280, lon: -110.5885 },
          { name: "Banff National Park", country: "Canada", region: "Alberta", city: "Banff", image: "https://images.unsplash.com/photo-1561134643-668f9057cce4?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Banff"), lat: 51.1784, lon: -115.5708 },
        ]
      },
    ],
  },
  {
    name: "South America",
    categories: [
      {
        name: "Iconic Landmarks",
        hotspots: [
          { name: "Christ the Redeemer", country: "Brazil", region: "Rio de Janeiro", city: "Rio de Janeiro", image: "https://images.unsplash.com/photo-1700677866588-95226be09b39?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Christ the Redeemer"), lat: -22.9519, lon: -43.2105 },
          { name: "Machu Picchu", country: "Peru", region: "Cusco Region", city: "Machu Picchu Pueblo", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Machu Picchu"), lat: -13.1631, lon: -72.5450 },
          { name: "Iguazu Falls", country: "Argentina/Brazil", region: "Misiones/Paraná", city: "Puerto Iguazú", image: "https://images.unsplash.com/photo-1538703012804-b74999aa11b9?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Iguazu Falls"), lat: -25.6953, lon: -54.4367 },
          { name: "Salar de Uyuni", country: "Bolivia", region: "Potosí", city: "Uyuni", image: "https://images.unsplash.com/photo-1526029655228-b7ee496c7819?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Salar de Uyuni"), lat: -20.2243, lon: -67.4534 },
          { name: "Galápagos Islands", country: "Ecuador", region: "Galápagos", city: "Galápagos", image: "https://images.unsplash.com/photo-1581875598938-cac706391c98?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Galápagos Islands"), lat: -0.9538, lon: -90.9656 },
        ],
      },
    ],
  },
  {
    name: "Europe",
    categories: [
      {
        name: "Iconic Landmarks & Cities",
        hotspots: [
          { name: "Eiffel Tower", country: "France", region: "Île-de-France", city: "Paris", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Eiffel Tower"), lat: 48.8584, lon: 2.2945 },
          { name: "Colosseum", country: "Italy", region: "Lazio", city: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Colosseum"), lat: 41.8902, lon: 12.4922 },
          { name: "Big Ben & Palace of Westminster", country: "UK", region: "England", city: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Big Ben"), lat: 51.5007, lon: -0.1246 },
          { name: "Acropolis of Athens", country: "Greece", region: "Attica", city: "Athens", image: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Acropolis"), lat: 37.9715, lon: 23.7257 },
          { name: "Sagrada Família", country: "Spain", region: "Catalonia", city: "Barcelona", image: "https://images.unsplash.com/photo-1650964827770-421afa7960ac?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Sagrada Familia"), lat: 41.4036, lon: 2.1744 },
          { name: "Neuschwanstein Castle", country: "Germany", region: "Bavaria", city: "Schwangau", image: "https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Neuschwanstein Castle"), lat: 47.5576, lon: 10.7498 },
          { name: "Stonehenge", country: "UK", region: "England", city: "Amesbury", image: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Stonehenge"), lat: 51.1789, lon: -1.8262 },
          { name: "Historic Centre of Prague", country: "Czech Republic", region: "Prague", city: "Prague", image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Prague"), lat: 50.0755, lon: 14.4378 },
        ],
      },
    ],
  },
  {
    name: "Asia",
    categories: [
      {
        name: "Iconic Landmarks",
        hotspots: [
          { name: "Great Wall of China", country: "China", region: "Beijing/Hebei", city: "Various", image: "https://images.unsplash.com/photo-1608037521277-154cd1b89191?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Great Wall of China"), lat: 40.4319, lon: 116.5704 },
          { name: "Taj Mahal", country: "India", region: "Uttar Pradesh", city: "Agra", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Taj Mahal"), lat: 27.1751, lon: 78.0421 },
          { name: "Angkor Wat", country: "Cambodia", region: "Siem Reap", city: "Siem Reap", image: "https://images.unsplash.com/photo-1599283787923-51b965a58b05?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Angkor Wat"), lat: 13.4125, lon: 103.8667 },
          { name: "Mount Fuji", country: "Japan", region: "Honshu", city: "Fujinomiya", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Mount Fuji"), lat: 35.3606, lon: 138.7278 },
          { name: "Burj Khalifa", country: "UAE", region: "Dubai", city: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Burj Khalifa"), lat: 25.1972, lon: 55.2744 },
          { name: "Petra", country: "Jordan", region: "Ma'an Governorate", city: "Petra", image: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Petra"), lat: 30.3285, lon: 35.4444 },
          { name: "Tokyo", country: "Japan", region: "Tokyo Metropolis", city: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Tokyo"), lat: 35.6762, lon: 139.6503 },
        ]
      }
    ]
  },
  {
    name: "Africa",
    categories: [
      {
        name: "Iconic Landmarks",
        hotspots: [
          { name: "Pyramids of Giza", country: "Egypt", region: "Giza Governorate", city: "Giza", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Pyramids of Giza"), lat: 29.9792, lon: 31.1342 },
          { name: "Table Mountain", country: "South Africa", region: "Western Cape", city: "Cape Town", image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Table Mountain"), lat: -33.9626, lon: 18.4098 },
          { name: "Victoria Falls", country: "Zambia/Zimbabwe", region: "Livingstone", city: "Victoria Falls", image: "https://images.unsplash.com/photo-1618811308896-d279d72fdf4d?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Victoria Falls"), lat: -17.9243, lon: 25.8572 },
        ]
      },
      {
        name: "Natural Wonders",
        hotspots: [
          { name: "Serengeti National Park", country: "Tanzania", region: "Mara/Simiyu", city: "Serengeti", image: "https://images.unsplash.com/photo-1694694866733-e79bf75b218b?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Serengeti"), lat: -2.3333, lon: 34.8333 },
        ]
      }
    ]
  },
  {
    name: "Oceania",
    categories: [
      {
        name: "Iconic Landmarks",
        hotspots: [
          { name: "Sydney Opera House", country: "Australia", region: "New South Wales", city: "Sydney", image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Sydney Opera House"), lat: -33.8568, lon: 151.2153 },
          { name: "Milford Sound", country: "New Zealand", region: "Southland", city: "Fiordland", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Milford Sound"), lat: -44.6718, lon: 167.9262 },
        ]
      },
      {
        name: "Natural Wonders",
        hotspots: [
          { name: "Great Barrier Reef", country: "Australia", region: "Queensland", city: "Off-coast", image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1600&q=80", thingsToDo: generateThingsToDo("Great Barrier Reef"), lat: -18.2871, lon: 147.6992 },
        ]
      }
    ]
  }
];
