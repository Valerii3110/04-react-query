import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import Loader from '../Loader/Loader';
import styles from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const IMAGE_ERROR_TOAST_ID = 'movie-image-error';

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClose = useCallback(() => {
    toast.dismiss(IMAGE_ERROR_TOAST_ID);
    setImageLoaded(false);
    setImageError(false);
    onClose();
  }, [onClose]);

  // Покажемо тост, якщо зображення відсутнє
  useEffect(() => {
    if (!movie.backdrop_path) {
      handleImageError();
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
      toast.dismiss(IMAGE_ERROR_TOAST_ID);
    };
  }, [handleClose, movie.backdrop_path]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleImageError = () => {
    setImageError(true);
    toast.error('Failed to load movie image', {
      id: IMAGE_ERROR_TOAST_ID,
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#ff4d4f',
        color: '#fff',
        fontWeight: '600',
        padding: '10px 16px',
        borderRadius: '8px',
        zIndex: 10000,
      },
    });
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <Toaster
        containerStyle={{ position: 'absolute', width: '100%', top: 10, left: 0, zIndex: 10001 }}
      />

      <div className={styles.modal}>
        <button className={styles.closeButton} aria-label="Close modal" onClick={handleClose}>
          &times;
        </button>

        {/* Лоадер */}
        {!imageLoaded && !imageError && <Loader />}

        {/* Зображення */}
        {movie.backdrop_path && !imageError && (
          <img
            className={styles.image}
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}

        {/* Контент */}
        {imageLoaded && !imageError && (
          <div className={styles.content}>
            <h2>{movie.title}</h2>
            <p>{movie.overview}</p>
            <p>
              <strong>Release Date:</strong> {movie.release_date ?? 'N/A'}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average ?? 'N/A'}/10
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default MovieModal;
