import axios from 'axios';
import type { MoviesResponse } from '../types/movie';

// Отримуємо ключ з .env
const API_KEY = import.meta.env.VITE_TMDB_KEY;
if (!API_KEY) throw new Error('TMDB API key is missing!');

// Створюємо інстанс axios з базовим URL та ключем
const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: API_KEY, // тут має бути **v3 ключ**, а не JWT
    language: 'en-US',
  },
});

// Функція пошуку фільмів
export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const { data } = await instance.get<MoviesResponse>('search/movie', {
    params: {
      query,
      page,
    },
  });

  return data;
};
