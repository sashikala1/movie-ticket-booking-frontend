import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await bookingService.getMine();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, []);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading bookings..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        {bookings.length ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Booking #{booking.id}</p>
                    <p className="text-sm text-slate-600">{booking.movieTitle ?? 'Movie'} • {booking.theatreName ?? 'Theatre'}</p>
                  </div>
                  {booking.status && <StatusBadge value={booking.status} />}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>Seats: {booking.seatNumbers.join(', ')}</span>
                  <span>Tickets: {booking.numberOfTickets}</span>
                  <span>Total: LKR {Number(booking.totalAmount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-4">
                  <Link to={`/bookings/${booking.id}`} className="text-red-600 hover:text-red-500 font-medium">View details</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No bookings yet." message="Your reservations will appear here after booking a show." />
        )}
      </div>
    </PublicLayout>
  );
}
