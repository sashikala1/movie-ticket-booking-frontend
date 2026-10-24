import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { movieService } from '../../services/movieService';
import { showService } from '../../services/showService';
import { theatreService } from '../../services/theatreService';
import type { Movie, Show, ShowStatus, Theatre } from '../../types';

const emptyForm = {
  movieId: '',
  theatreId: '',
  showDate: '',
  showTime: '',
  ticketPrice: '',
  status: 'SCHEDULED' as ShowStatus,
};

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadShows = async () => {
    try {
      setLoading(true);
      const [showData, movieData, theatreData] = await Promise.all([
        showService.getAll(),
        movieService.getAll(),
        theatreService.getAll(),
      ]);

      setShows(showData);
      setMovies(movieData);
      setTheatres(theatreData);
      if (!selectedShow && showData[0]) setSelectedShow(showData[0]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load show data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadShows();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (show: Show) => {
    setSelectedShow(show);
    setEditingId(show.id);
    setForm({
      movieId: String(show.movieId),
      theatreId: String(show.theatreId),
      showDate: show.showDate,
      showTime: show.showTime,
      ticketPrice: String(show.ticketPrice),
      status: show.status ?? 'SCHEDULED',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      movieId: Number(form.movieId),
      theatreId: Number(form.theatreId),
      showDate: form.showDate,
      showTime: form.showTime,
      ticketPrice: Number(form.ticketPrice),
      status: form.status,
    };

    if (!payload.movieId || !payload.theatreId || !payload.showDate || !payload.showTime || Number.isNaN(payload.ticketPrice) || payload.ticketPrice <= 0) {
      setError('Please provide valid show details and a positive ticket price.');
      return;
    }

    try {
      if (editingId) {
        await showService.updateShow(editingId, payload);
      } else {
        await showService.createShow(payload);
      }
      resetForm();
      await loadShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save show.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await showService.deleteShow(id);
      if (selectedShow?.id === id) setSelectedShow(null);
      await loadShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete show.');
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Shows</h1>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading shows...</div>
            ) : shows.length === 0 ? (
              <div className="p-6 text-slate-500">No shows available.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Movie</th>
                    <th className="px-4 py-3">Theatre</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show) => (
                    <tr key={show.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{show.movieTitle}</td>
                      <td className="px-4 py-3">{show.theatreName}</td>
                      <td className="px-4 py-3">{show.showDate}</td>
                      <td className="px-4 py-3">LKR {Number(show.ticketPrice).toLocaleString()}</td>
                      <td className="space-x-2 px-4 py-3">
                        <button type="button" onClick={() => setSelectedShow(show)} className="text-sky-600 hover:underline">View</button>
                        <button type="button" onClick={() => handleEdit(show)} className="text-indigo-600 hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(show.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-4">
            {selectedShow && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Show Details</h2>
                <dl className="mt-3 space-y-2 text-sm text-slate-600">
                  <div><dt className="font-medium text-slate-800">Movie</dt><dd>{selectedShow.movieTitle}</dd></div>
                  <div><dt className="font-medium text-slate-800">Theatre</dt><dd>{selectedShow.theatreName}</dd></div>
                  <div><dt className="font-medium text-slate-800">Date & Time</dt><dd>{selectedShow.showDate} {selectedShow.showTime}</dd></div>
                  <div><dt className="font-medium text-slate-800">Price</dt><dd>LKR {Number(selectedShow.ticketPrice).toLocaleString()}</dd></div>
                  <div><dt className="font-medium text-slate-800">Status</dt><dd>{selectedShow.status}</dd></div>
                </dl>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Show' : 'Add Show'}</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Movie</label>
                <select value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required>
                  <option value="">Select movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Theatre</label>
                <select value={form.theatreId} onChange={(e) => setForm({ ...form, theatreId: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required>
                  <option value="">Select theatre</option>
                  {theatres.map((theatre) => (
                    <option key={theatre.id} value={theatre.id}>{theatre.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Show Date</label>
                  <input type="date" value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Show Time</label>
                  <input type="time" value={form.showTime} onChange={(e) => setForm({ ...form, showTime: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Ticket Price</label>
                  <input type="number" min="1" step="0.01" value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ShowStatus })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">{editingId ? 'Update Show' : 'Save Show'}</button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
