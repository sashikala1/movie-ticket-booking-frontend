import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { theatreService } from '../../services/theatreService';
import type { Theatre, TheatreStatus } from '../../types';

const emptyForm = {
  name: '',
  location: '',
  capacity: '',
  status: 'ACTIVE' as TheatreStatus,
};

export default function AdminTheatresPage() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTheatre, setSelectedTheatre] = useState<Theatre | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadTheatres = async () => {
    try {
      setLoading(true);
      const data = await theatreService.getAll();
      setTheatres(data);
      if (!selectedTheatre && data[0]) setSelectedTheatre(data[0]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load theatres.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTheatres();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (theatre: Theatre) => {
    setSelectedTheatre(theatre);
    setEditingId(theatre.id);
    setForm({
      name: theatre.name,
      location: theatre.location,
      capacity: String(theatre.capacity),
      status: theatre.status ?? 'ACTIVE',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      capacity: Number(form.capacity),
      status: form.status,
    };

    if (!payload.name || !payload.location || Number.isNaN(payload.capacity) || payload.capacity <= 0) {
      setError('Please supply a valid theatre name, location and capacity.');
      return;
    }

    try {
      if (editingId) {
        await theatreService.updateTheatre(editingId, payload);
      } else {
        await theatreService.createTheatre(payload);
      }
      resetForm();
      await loadTheatres();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save theatre.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this theatre?')) return;
    try {
      await theatreService.deleteTheatre(id);
      if (selectedTheatre?.id === id) setSelectedTheatre(null);
      await loadTheatres();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete theatre.');
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Theatres</h1>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading theatres...</div>
            ) : theatres.length === 0 ? (
              <div className="p-6 text-slate-500">No theatres available.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {theatres.map((theatre) => (
                    <tr key={theatre.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{theatre.name}</td>
                      <td className="px-4 py-3">{theatre.location}</td>
                      <td className="px-4 py-3">{theatre.capacity}</td>
                      <td className="px-4 py-3">{theatre.status}</td>
                      <td className="space-x-2 px-4 py-3">
                        <button type="button" onClick={() => setSelectedTheatre(theatre)} className="text-sky-600 hover:underline">View</button>
                        <button type="button" onClick={() => handleEdit(theatre)} className="text-indigo-600 hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(theatre.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-4">
            {selectedTheatre && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Theatre Details</h2>
                <dl className="mt-3 space-y-2 text-sm text-slate-600">
                  <div><dt className="font-medium text-slate-800">Name</dt><dd>{selectedTheatre.name}</dd></div>
                  <div><dt className="font-medium text-slate-800">Location</dt><dd>{selectedTheatre.location}</dd></div>
                  <div><dt className="font-medium text-slate-800">Capacity</dt><dd>{selectedTheatre.capacity}</dd></div>
                  <div><dt className="font-medium text-slate-800">Status</dt><dd>{selectedTheatre.status}</dd></div>
                </dl>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Theatre' : 'Add Theatre'}</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Capacity</label>
                  <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TheatreStatus })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">{editingId ? 'Update Theatre' : 'Save Theatre'}</button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
