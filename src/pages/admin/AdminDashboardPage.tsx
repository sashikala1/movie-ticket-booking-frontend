import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { bookingService } from '../../services/bookingService';
import { movieService } from '../../services/movieService';
import { paymentService } from '../../services/paymentService';
import { showService } from '../../services/showService';
import { theatreService } from '../../services/theatreService';
import { userService } from '../../services/userService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    theatres: 0,
    shows: 0,
    bookings: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [users, movies, theatres, shows, bookings, payments] = await Promise.all([
          userService.getUsers(),
          movieService.getAll(),
          theatreService.getAll(),
          showService.getAll(),
          bookingService.getAll(),
          paymentService.getAll(),
        ]);

        if (!active) return;

        setStats({
          users: users.length,
          movies: movies.length,
          theatres: theatres.length,
          shows: shows.length,
          bookings: bookings.length,
          payments: payments.length,
        });
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load dashboard statistics.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, path: '/admin/users' },
    { label: 'Total Movies', value: stats.movies, path: '/admin/movies' },
    { label: 'Total Theatres', value: stats.theatres, path: '/admin/theatres' },
    { label: 'Total Shows', value: stats.shows, path: '/admin/shows' },
    { label: 'Total Bookings', value: stats.bookings, path: '/admin/bookings' },
    { label: 'Total Payments', value: stats.payments, path: '/admin/payments' },
  ];

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <Link to="/admin/movies" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
            Add Movie
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">Loading dashboard...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.path}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Link to="/admin/users" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">Manage Users</Link>
          <Link to="/admin/movies" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">Manage Movies</Link>
          <Link to="/admin/theatres" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">Manage Theatres</Link>
          <Link to="/admin/shows" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">Manage Shows</Link>
          <Link to="/admin/bookings" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">View Bookings</Link>
          <Link to="/admin/payments" className="rounded-xl border border-slate-200 bg-white p-4 font-medium text-slate-700 shadow-sm hover:border-slate-300">View Payments</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
