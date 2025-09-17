import type { Show, ShowRow } from '@/types/shows';

const MAX_MOCK_SHOWS = 55;
const MOCK_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'];
const MOCK_ROW_TITLES = [
  'Trending Now',
  'Popular on MyFlix',
  'Top Picks for You',
  'Recently Added',
  'Action & Adventure',
  'Comedies',
  'Documentaries',
  'Dramas',
  'Horror Movies',
  'Sci-Fi & Fantasy',
];

// Pick a random show index to display in the hero section.
const FEATURED_SHOW_INDEX = Math.floor(Math.random() * (MAX_MOCK_SHOWS - 1));

/** Generate dummy shows displaying in the home page. */
export const generateDummyShows = (): Show[] => {
  const shows: Show[] = [];

  for (let i = 1; i <= MAX_MOCK_SHOWS; i++) {
    shows.push({
      id: `show-${i}`,
      title: `Show Title ${i}`,
      description: `This is the description for show ${i}. It's an amazing show with great storytelling and compelling characters.`,
      imageUrl: `https://picsum.photos/1920/1080?random=${i + 100}`,
      // Rating is between 3 and 5.
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      // Year is between 2020 and 2024.
      year: 2020 + Math.floor(Math.random() * 5),
      genre: [
        MOCK_GENRES[Math.floor(Math.random() * MOCK_GENRES.length)],
        MOCK_GENRES[Math.floor(Math.random() * MOCK_GENRES.length)],
      ],
      duration: `${Math.floor(Math.random() * 60 + 90)} min`,
      isInMyList: false,
      isFeatured: i === FEATURED_SHOW_INDEX,
    });
  }

  return shows;
};

/** Generate dummy show rows displaying in the home page. */
export const generateDummyShowRows = (shows: Show[]): ShowRow[] => {
  return MOCK_ROW_TITLES.map((title, index) => ({
    id: `row-${index}`,
    title,
    // Overlapping shows for variety and a more realistic look :)
    shows: shows.slice(index * 5, (index + 1) * 5 + 5),
  }));
};
