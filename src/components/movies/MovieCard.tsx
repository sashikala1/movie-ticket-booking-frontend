import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import StatusBadge from '../common/StatusBadge';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-red-700 text-xl font-bold text-white">
        {movie.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{movie.title}</h3>
          {movie.status && <StatusBadge value={movie.status} />}
        </div>
        <p className="line-clamp-3 text-sm text-slate-600">{movie.description ?? 'No description available.'}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>{movie.genre}</span>
          <span>•</span>
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.duration} min</span>
        </div>
        <Link to={`/movies/${movie.id}`} className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-500">
          View details
        </Link>
      </div>
    </article>
  );
}
