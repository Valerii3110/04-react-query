import axios from 'axios';
import type { Movie } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3';

const token = import.meta.env.VITE_TMDB_TOKEN;
if (!token) {
  throw new Error('TMDB Bearer token is missing! Add VITE_TMDB_TOKEN to your .env');
}

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
axios.defaults.headers.common['accept'] = 'application/json';

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const { data } = await axios.get<MoviesResponse>('/search/movie', {
    params: { query, page },
  });

  return data;
};
