import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { paymentService } from '../../services/paymentService';
import type { Payment } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';

export default function PaymentStatusPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await paymentService.getStatus(Number(id));
        setPayment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to check payment status.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [id]);

  if (loading) return <PublicLayout><LoadingSpinner label="Checking payment status..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;
  if (!payment) return <PublicLayout><div className="rounded bg-white p-6">No payment record found.</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Payment result</h1>
        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm text-slate-600">Status:</span>
          {payment.status && <StatusBadge value={payment.status} />}
        </div>
        <div className="mt-5 space-y-3 text-slate-600">
          <p><span className="font-medium text-slate-800">Payment ID:</span> {payment.id}</p>
          <p><span className="font-medium text-slate-800">Booking ID:</span> {payment.bookingId}</p>
          <p><span className="font-medium text-slate-800">Amount:</span> LKR {Number(payment.amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><span className="font-medium text-slate-800">Method:</span> {payment.paymentMethod}</p>
        </div>
        <div className="mt-6">
          <Link to="/bookings" className="inline-flex rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500">View my bookings</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
