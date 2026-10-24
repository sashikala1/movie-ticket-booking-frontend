import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await bookingService.getById(Number(id));
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load booking.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [id]);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading booking details..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;
  if (!booking) return <PublicLayout><EmptyState title="Booking not found." message="We could not find this booking." /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Booking #{booking.id}</h1>
          {booking.status && <StatusBadge value={booking.status} />}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-slate-600">
            <p><span className="font-medium text-slate-800">Movie:</span> {booking.movieTitle}</p>
            <p><span className="font-medium text-slate-800">Theatre:</span> {booking.theatreName}</p>
            <p><span className="font-medium text-slate-800">Seats:</span> {booking.seatNumbers.join(', ')}</p>
            <p><span className="font-medium text-slate-800">Number of tickets:</span> {booking.numberOfTickets}</p>
            <p><span className="font-medium text-slate-800">Total:</span> LKR {Number(booking.totalAmount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-slate-600">
            <p><span className="font-medium text-slate-800">Booking ID:</span> {booking.id}</p>
            <p><span className="font-medium text-slate-800">Show ID:</span> {booking.showId}</p>
            <p><span className="font-medium text-slate-800">Date:</span> {booking.bookingDate ?? 'Not available'}</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
