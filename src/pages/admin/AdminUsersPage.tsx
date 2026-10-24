import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { userService } from '../../services/userService';
import type { User } from '../../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      if (!selectedUser && data[0]) setSelectedUser(data[0]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', email: '', password: '' });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditingId(user.id ?? null);
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    if (!trimmedName || !trimmedEmail) {
      setError('Name and email are required.');
      return;
    }

    try {
      const payload: Partial<User> & { password?: string } = {
        name: trimmedName,
        email: trimmedEmail,
      };

      if (form.password.trim()) payload.password = form.password.trim();

      await userService.updateUser(editingId, payload);
      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update user.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await userService.deleteUser(id);
      if (selectedUser?.id === id) setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete user.');
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-slate-500">No users found.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-3">{user.id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role ?? 'CUSTOMER'}</td>
                      <td className="space-x-2 px-4 py-3">
                        <button type="button" onClick={() => setSelectedUser(user)} className="text-sky-600 hover:underline">View</button>
                        <button type="button" onClick={() => handleEdit(user)} className="text-indigo-600 hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(user.id ?? 0)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-4">
            {selectedUser && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">User Details</h2>
                <dl className="mt-3 space-y-2 text-sm text-slate-600">
                  <div><dt className="font-medium text-slate-800">ID</dt><dd>{selectedUser.id}</dd></div>
                  <div><dt className="font-medium text-slate-800">Name</dt><dd>{selectedUser.name}</dd></div>
                  <div><dt className="font-medium text-slate-800">Email</dt><dd>{selectedUser.email}</dd></div>
                  <div><dt className="font-medium text-slate-800">Role</dt><dd>{selectedUser.role ?? 'CUSTOMER'}</dd></div>
                </dl>
              </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit User' : 'User Form'}</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">New Password (optional)</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Leave blank to keep current password" />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={!editingId} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                  Save Changes
                </button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
