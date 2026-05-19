
export type Page = 'home' | 'explore' | 'journal' | 'tripplanner' | 'login' | 'signup' | 'loading';

export interface Hotspot {
  name: string;
  country: string;
  region: string;
  city: string;
  image: string;
  thingsToDo: { name: string; description: string; image: string }[];
  lat?: number;
  lon?: number;
}

export interface DestinationCategory {
  name: string;
  description?: string;
  hotspots: Hotspot[];
}

export interface Continent {
  name: string;
  categories: DestinationCategory[];
}

export interface JournalPost {
  id: number;
  title: string;
  content: string;
  rating: number;
  image?: string;
  file?: string;
  author: string;
  location: string;
  date: string;
}

export interface HighlightReview {
  id: number;
  author: string;
  location: string;
  review: string;
  rating: number;
}

export interface BudgetItem {
  id: number;
  category: string;
  estimated: number;
  actual: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';