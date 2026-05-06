export interface User {
  id: number;
  name: string;
  email: string;
  subscription: string;
}

export interface Paper {
  id?: number;
  title: string;
  abstract: string;
  year: string;
  url: string;
  source: string;
  similarity?: number;
  citation?: string;
}

export interface SearchHistory {
  id: number;
  query: string;
  timestamp: string;
}
