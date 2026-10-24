import { Link } from 'react-router-dom';
import type { Show } from '../../types';
import StatusBadge from '../common/StatusBadge';

export default function ShowCard({ show }: { show: Show }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{show.movieTitle}</h3>
          <p className="text-sm text-slate-600">{show.theatreName}</p>
        </div>
        {show.status && <StatusBadge value={show.status} />}
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        <p>{show.showDate}</p>
        <p>{show.showTime}</p>
        <p>LKR {Number(show.ticketPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>

      <Link to={`/shows/${show.id}`} className="mt-4 inline-flex text-sm font-medium text-red-600 hover:text-red-500">
        View show
      </Link>
    </article>
  );
}
