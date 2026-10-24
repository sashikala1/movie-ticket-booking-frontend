import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import type { Booking, PaymentMethod } from '../../types';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!bookingId) return;
      try {
        const data = await bookingService.getById(Number(bookingId));
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load payment details.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!booking) return;
    try {
      setSubmitting(true);
      const result = await paymentService.create({ bookingId: booking.id, amount: Number(booking.totalAmount), paymentMethod: method });
      navigate(`/payments/${result.id}/status`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process payment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PublicLayout><LoadingSpinner label="Loading payment details..." /></PublicLayout>;
  if (!booking) return <PublicLayout><ErrorMessage message={error || 'Unable to load booking.'} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Payment</h1>
        <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p><span className="font-medium text-slate-800">Movie:</span> {booking.movieTitle}</p>
          <p><span className="font-medium text-slate-800">Theatre:</span> {booking.theatreName}</p>
          <p><span className="font-medium text-slate-800">Amount:</span> LKR {Number(booking.totalAmount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Payment method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="w-full rounded border border-slate-300 px-3 py-2 focus:border-red-500 focus:outline-none"
          >
            <option value="CARD">CARD</option>
            <option value="CASH">CASH</option>
            <option value="BANK_TRANSFER">BANK_TRANSFER</option>
          </select>

          {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? 'Processing...' : 'Pay now'}
            </Button>
            <Link to="/bookings"><Button variant="secondary">Back to bookings</Button></Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
