export interface Show {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  year: number;
  genre: string[];
  duration: string;
  isInMyList: boolean;
  isFeatured: boolean;
}

export interface ShowRow {
  id: string;
  title: string;
  shows: Show[];
}

export interface ShowsState {
  showRows: ShowRow[];
  myList: Show[];
}

export interface ShowsActions {
  initMockData: () => void;
  addToMyList: (show: Show) => void;
  removeFromMyList: (showId: string) => void;
  getFeaturedShow: () => Show | null;
}
