import { create } from 'zustand';

import { generateDummyShows, generateDummyShowRows } from '@/lib/shows';
import type { ShowsState, Show, ShowsActions } from '@/types/shows';

export const useShowsStore = create<ShowsState & ShowsActions>((set, get) => ({
  // State
  showRows: [],
  myList: [],

  // Actions
  initMockData: () => {
    const shows = generateDummyShows();
    const showRows = generateDummyShowRows(shows);
    const myList = shows.filter(show => show.isInMyList);
    
    set({
      showRows,
      myList,
    });
  },

  addToMyList: (show: Show) => {
    const { myList } = get();
    if (!myList.find(item => item.id === show.id)) {
      set({
        myList: [...myList, { ...show, isInMyList: true }],
        showRows: get().showRows.map(row => ({
          ...row,
          shows: row.shows.map(s => 
            s.id === show.id ? { ...s, isInMyList: true } : s
          ),
        })),
      });
    }
  },

  removeFromMyList: (showId: string) => {
    const { myList } = get();
    set({
      myList: myList.filter(item => item.id !== showId),
      showRows: get().showRows.map(row => ({
        ...row,
        shows: row.shows.map(s => 
          s.id === showId ? { ...s, isInMyList: false } : s
        ),
      })),
    });
  },

  getFeaturedShow: () => {
    const { showRows } = get();
    return showRows.find(
      row => row.shows.some(show => show.isFeatured),
    )?.shows.find(show => show.isFeatured) || null;
  },
}));
