import type { Theatre } from '../../types';
import StatusBadge from '../common/StatusBadge';

export default function TheatreCard({ theatre }: { theatre: Theatre }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{theatre.name}</h3>
        {theatre.status && <StatusBadge value={theatre.status} />}
      </div>
      <div className="space-y-1 text-sm text-slate-600">
        <p>{theatre.location}</p>
        <p>Capacity: {theatre.capacity}</p>
      </div>
    </article>
  );
}
