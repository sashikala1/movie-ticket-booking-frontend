import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/theatres', label: 'Theatres' },
    { to: '/shows', label: 'Shows' },
  ];

  const customerLinks = [
    { to: '/bookings', label: 'My Bookings' },
    { to: '/bookings/new/1', label: 'Booking' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/movies', label: 'Movies' },
    { to: '/admin/theatres', label: 'Theatres' },
    { to: '/admin/shows', label: 'Shows' },
    { to: '/admin/bookings', label: 'Bookings' },
    { to: '/admin/payments', label: 'Payments' },
    { to: '/admin/users', label: 'Users' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-red-600">MovieBook</Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'text-red-600' : '')}>
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && user?.role === 'CUSTOMER' &&
            customerLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'text-red-600' : '')}>
                {link.label}
              </NavLink>
            ))}

          {isAuthenticated && user?.role === 'ADMIN' &&
            adminLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'text-red-600' : '')}>
                {link.label}
              </NavLink>
            ))}

          {!isAuthenticated ? (
            <>
              <NavLink to="/signin" className={({ isActive }) => (isActive ? 'text-red-600' : '')}>Sign In</NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'text-red-600' : '')}>Sign Up</NavLink>
            </>
          ) : (
            <>
              <span className="text-slate-500">{user?.email}</span>
              <button type="button" onClick={logout} className="rounded bg-slate-900 px-3 py-2 text-white hover:bg-slate-700">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
