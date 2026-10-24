import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { movieService } from '../../services/movieService';
import type { Movie } from '../../types';
import MovieCard from '../../components/movies/MovieCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAll();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMovies();
  }, []);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading movies..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Movies</h1>
        {movies.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        ) : (
          <EmptyState title="No movies found." message="Try checking back later." />
        )}
      </div>
    </PublicLayout>
  );
}
