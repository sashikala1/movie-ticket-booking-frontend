import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { showService } from '../../services/showService';
import type { Show } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

export default function ShowDetailPage() {
  const { id } = useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await showService.getById(Number(id));
        setShow(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load show details.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [id]);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading show details..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;
  if (!show) return <PublicLayout><EmptyState title="Show not found." message="This show cannot be found." /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600">Show details</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{show.movieTitle}</h1>
          </div>
          {show.status && <StatusBadge value={show.status} />}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 text-slate-600">
            <p><span className="font-medium text-slate-800">Theatre:</span> {show.theatreName}</p>
            <p><span className="font-medium text-slate-800">Date:</span> {show.showDate}</p>
            <p><span className="font-medium text-slate-800">Time:</span> {show.showTime}</p>
            <p><span className="font-medium text-slate-800">Ticket price:</span> LKR {Number(show.ticketPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Booking</p>
            <Link to={`/bookings/new/${show.id}`}>
              <Button className="w-full">Book this show</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
