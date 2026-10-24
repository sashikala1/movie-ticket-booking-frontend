import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.signup(form);
      signup(response.token);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>
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
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link to="/signin" className="font-medium text-red-600">Sign in</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
