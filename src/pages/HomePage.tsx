import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PublicLayout from '../layouts/PublicLayout';
import { movieService } from '../services/movieService';
import { showService } from '../services/showService';
import type { Movie, Show } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import MovieCard from '../components/movies/MovieCard';
import ShowCard from '../components/shows/ShowCard';

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [movieData, showData] = await Promise.all([movieService.getAll(), showService.getAll()]);
        setMovies(movieData.slice(0, 4));
        setShows(showData.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load home page.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <PublicLayout>
      <section className="mb-10 rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-red-800 p-8 text-white shadow-lg">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-200">Now showing</p>
          <h1 className="text-4xl font-bold tracking-tight">Find your next movie night.</h1>
          <p className="text-slate-200">Explore the latest movies, compare showtimes, and book your seats in a few steps.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/movies" className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500">Browse Movies</Link>
            <Link to="/shows" className="rounded border border-white/30 px-4 py-2 font-medium text-white hover:bg-white/10">View Shows</Link>
          </div>
        </div>
      </section>

      {loading ? <LoadingSpinner label="Loading movies..." /> : error ? <ErrorMessage message={error} /> : (
        <>
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Currently showing</h2>
              <Link to="/movies" className="text-sm font-medium text-red-600">View all</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {movies.length ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />) : <p className="text-slate-600">No movies found.</p>}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming shows</h2>
              <Link to="/shows" className="text-sm font-medium text-red-600">View all</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {shows.length ? shows.map((show) => <ShowCard key={show.id} show={show} />) : <p className="text-slate-600">No shows found.</p>}
            </div>
          </section>
        </>
      )}
    </PublicLayout>
  );
}
