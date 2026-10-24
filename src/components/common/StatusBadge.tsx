export default function StatusBadge({ value }: { value?: string }) {
  const colorMap: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    INACTIVE: 'bg-slate-200 text-slate-700',
    NOW_SHOWING: 'bg-emerald-100 text-emerald-800',
    UPCOMING: 'bg-amber-100 text-amber-800',
    ENDED: 'bg-slate-200 text-slate-700',
    SCHEDULED: 'bg-sky-100 text-sky-800',
    COMPLETED: 'bg-violet-100 text-violet-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-emerald-100 text-emerald-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-slate-200 text-slate-700',
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colorMap[value ?? ''] ?? 'bg-slate-100 text-slate-700'}`}>
      {value ?? 'UNKNOWN'}
    </span>
  );
}
