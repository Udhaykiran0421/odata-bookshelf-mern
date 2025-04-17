
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  publishDate: string;
}

export interface BookFormValues {
  title: string;
  author: string;
  genre: string;
  price: number;
  publishDate: string;
}

export interface BookFilterValues {
  title?: string;
  author?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
