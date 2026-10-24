import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { movieService } from '../../services/movieService';
import { showService } from '../../services/showService';
import type { Movie, Show } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const [movieData, showData] = await Promise.all([
          movieService.getById(Number(id)),
          showService.getByMovieId(Number(id)),
        ]);
        setMovie(movieData);
        setShows(showData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    void fetchMovie();
  }, [id]);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading movie details..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;
  if (!movie) return <PublicLayout><EmptyState title="Movie not found." message="The movie you requested is not available." /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex h-52 w-full max-w-xs items-center justify-center rounded-xl bg-linear-to-br from-slate-900 to-red-700 text-3xl font-bold text-white md:w-56">
              {movie.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">{movie.title}</h1>
                {movie.status && <StatusBadge value={movie.status} />}
              </div>
              <p className="text-slate-600">{movie.description ?? 'No description available for this title.'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{movie.genre}</span>
                <span>•</span>
                <span>{movie.language}</span>
                <span>•</span>
                <span>{movie.duration} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Available shows</h2>
          {shows.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shows.map((show) => (
                <div key={show.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">{show.theatreName}</p>
                  <p className="mt-2 text-sm text-slate-600">{show.showDate} • {show.showTime}</p>
                  <p className="mt-2 text-sm text-slate-600">LKR {Number(show.ticketPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  {show.status && <div className="mt-3"><StatusBadge value={show.status} /></div>}
                  <Link to={`/shows/${show.id}`} className="mt-4 inline-flex rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500">
                    Book now
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No shows available." message="This movie has no scheduled shows right now." />
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
