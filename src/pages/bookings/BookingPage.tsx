import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import SeatGrid from '../../components/bookings/SeatGrid';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { showService } from '../../services/showService';
import { bookingService } from '../../services/bookingService';
import type { Show } from '../../types';

export default function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!showId) return;
      try {
        const [showData, seatData] = await Promise.all([
          showService.getById(Number(showId)),
          showService.getSeatAvailability(Number(showId)),
        ]);
        setShow(showData);
        setAvailableSeats(seatData.availableSeats ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load booking screen.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [showId]);

  const ticketPrice = show?.ticketPrice ?? 0;
  const total = useMemo(() => Number(ticketPrice) * selectedSeats.length, [selectedSeats.length, ticketPrice]);

  const onToggleSeat = (seat: string) => {
    setSelectedSeats((current) => {
      if (current.includes(seat)) return current.filter((item) => item !== seat);
      return [...current, seat];
    });
  };

  const handleCreateBooking = async () => {
    if (!show || selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const createdBooking = await bookingService.create({
        showId: show.id,
        seatNumbers: selectedSeats,
        numberOfTickets: selectedSeats.length,
      });
      navigate(`/payments/${createdBooking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PublicLayout><LoadingSpinner label="Loading booking details..." /></PublicLayout>;
  if (error && !show) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Select seats</h1>
        {show && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">{show.movieTitle}</p>
            <p className="text-sm text-slate-600">{show.theatreName} • {show.showDate} • {show.showTime}</p>
          </div>
        )}

        <SeatGrid availableSeats={availableSeats} selectedSeats={selectedSeats} onToggleSeat={onToggleSeat} />

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
            <span>Selected Seats: {selectedSeats.join(', ') || 'None'}</span>
            <span>Tickets: {selectedSeats.length}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-slate-600">Ticket Price</span>
            <span className="font-medium text-slate-800">LKR {Number(ticketPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="mb-5 flex items-center justify-between">
            <span className="text-slate-600">Total</span>
            <span className="text-xl font-bold text-slate-900">LKR {total.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <Button onClick={handleCreateBooking} disabled={submitting || selectedSeats.length === 0} className="w-full">
            {submitting ? 'Creating booking...' : 'Confirm booking'}
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
