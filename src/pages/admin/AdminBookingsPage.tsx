import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { bookingService } from '../../services/bookingService';
import type { Booking, BookingStatus } from '../../types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data);
      if (!selectedBooking && data[0]) setSelectedBooking(data[0]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const handleStatusChange = async (bookingId: number, status: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update booking status.');
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="p-6 text-slate-500">No bookings found.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Movie</th>
                    <th className="px-4 py-3">Theatre</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{booking.id}</td>
                      <td className="px-4 py-3">{booking.movieTitle}</td>
                      <td className="px-4 py-3">{booking.theatreName}</td>
                      <td className="px-4 py-3">{booking.status}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedBooking(booking)} className="mr-2 text-sky-600 hover:underline">View</button>
                        <select
                          value={booking.status ?? 'PENDING'}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selectedBooking && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Booking Details</h2>
              <dl className="mt-3 space-y-2 text-sm text-slate-600">
                <div><dt className="font-medium text-slate-800">Booking ID</dt><dd>{selectedBooking.id}</dd></div>
                <div><dt className="font-medium text-slate-800">Movie</dt><dd>{selectedBooking.movieTitle}</dd></div>
                <div><dt className="font-medium text-slate-800">Theatre</dt><dd>{selectedBooking.theatreName}</dd></div>
                <div><dt className="font-medium text-slate-800">Seats</dt><dd>{selectedBooking.seatNumbers?.join(', ')}</dd></div>
                <div><dt className="font-medium text-slate-800">Tickets</dt><dd>{selectedBooking.numberOfTickets}</dd></div>
                <div><dt className="font-medium text-slate-800">Total</dt><dd>LKR {Number(selectedBooking.totalAmount).toLocaleString()}</dd></div>
                <div><dt className="font-medium text-slate-800">Status</dt><dd>{selectedBooking.status}</dd></div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
