import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { paymentService } from '../../services/paymentService';
import type { Payment } from '../../types';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getAll();
        setPayments(data);
        if (!selectedPayment && data[0]) setSelectedPayment(data[0]);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load payments.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="p-6 text-slate-500">No payments are currently available from the backend.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{payment.id}</td>
                      <td className="px-4 py-3">{payment.bookingId}</td>
                      <td className="px-4 py-3">LKR {Number(payment.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">{payment.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedPayment(payment)} className="text-sky-600 hover:underline">{payment.status}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedPayment && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
              <dl className="mt-3 space-y-2 text-sm text-slate-600">
                <div><dt className="font-medium text-slate-800">Payment ID</dt><dd>{selectedPayment.id}</dd></div>
                <div><dt className="font-medium text-slate-800">Booking ID</dt><dd>{selectedPayment.bookingId}</dd></div>
                <div><dt className="font-medium text-slate-800">Amount</dt><dd>LKR {Number(selectedPayment.amount).toLocaleString()}</dd></div>
                <div><dt className="font-medium text-slate-800">Method</dt><dd>{selectedPayment.paymentMethod}</dd></div>
                <div><dt className="font-medium text-slate-800">Status</dt><dd>{selectedPayment.status}</dd></div>
                <div><dt className="font-medium text-slate-800">Payment Date</dt><dd>{selectedPayment.paymentDate ?? 'N/A'}</dd></div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
