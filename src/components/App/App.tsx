import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';

import { fetchMovies } from '../../services/movieService';
import type { Movie, MoviesResponse } from '../../types/movie';

import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Використання useQuery
  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
  });

  // Сабміт пошуку
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast('Please enter your search query.');
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  // Вибір фільму
  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && (
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          Network/server error. Please try again.
        </p>
      )}

      {data && data.results.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: 20 }}>No movies found.</p>
      )}

      {data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />

          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
