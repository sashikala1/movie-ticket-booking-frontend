import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.signin(form);
      login(response.token);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>
          {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Need an account? <Link to="/signup" className="font-medium text-red-600">Create one</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
