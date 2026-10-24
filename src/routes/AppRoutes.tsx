import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SignInPage from '../pages/auth/SignInPage';
import SignUpPage from '../pages/auth/SignUpPage';
import MoviesPage from '../pages/movies/MoviesPage';
import MovieDetailPage from '../pages/movies/MovieDetailPage';
import TheatresPage from '../pages/theatres/TheatresPage';
import ShowsPage from '../pages/shows/ShowsPage';
import ShowDetailPage from '../pages/shows/ShowDetailPage';
import MyBookingsPage from '../pages/bookings/MyBookingsPage';
import BookingDetailPage from '../pages/bookings/BookingDetailPage';
import BookingPage from '../pages/bookings/BookingPage';
import PaymentPage from '../pages/payments/PaymentPage';
import PaymentStatusPage from '../pages/payments/PaymentStatusPage';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminMoviesPage from '../pages/admin/AdminMoviesPage';
import AdminTheatresPage from '../pages/admin/AdminTheatresPage';
import AdminShowsPage from '../pages/admin/AdminShowsPage';
import AdminBookingsPage from '../pages/admin/AdminBookingsPage';
import AdminPaymentsPage from '../pages/admin/AdminPaymentsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/movies/:id" element={<MovieDetailPage />} />
      <Route path="/theatres" element={<TheatresPage />} />
      <Route path="/shows" element={<ShowsPage />} />
      <Route path="/shows/:id" element={<ShowDetailPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/bookings/new/:showId" element={<BookingPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/payments/:bookingId" element={<PaymentPage />} />
        <Route path="/payments/:id/status" element={<PaymentStatusPage />} />
      </Route>

      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/movies" element={<AdminMoviesPage />} />
        <Route path="/admin/theatres" element={<AdminTheatresPage />} />
        <Route path="/admin/shows" element={<AdminShowsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
