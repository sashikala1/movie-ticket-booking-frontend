import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { movieService } from '../../services/movieService';
import type { Movie, MovieStatus } from '../../types';

const emptyForm = {
  title: '',
  description: '',
  duration: '',
  language: '',
  genre: '',
  releaseDate: '',
  status: 'NOW_SHOWING' as MovieStatus,
};

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAll();
      setMovies(data);
      if (!selectedMovie && data[0]) setSelectedMovie(data[0]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMovies();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      description: movie.description ?? '',
      duration: String(movie.duration ?? ''),
      language: movie.language ?? '',
      genre: movie.genre ?? '',
      releaseDate: movie.releaseDate ?? '',
      status: movie.status ?? 'NOW_SHOWING',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      duration: Number(form.duration),
      language: form.language.trim(),
      genre: form.genre.trim(),
      releaseDate: form.releaseDate,
      status: form.status,
    };

    if (!payload.title || !payload.language || !payload.genre || !payload.releaseDate || Number.isNaN(payload.duration) || payload.duration <= 0) {
      setError('Please fill in all required movie fields with valid values.');
      return;
    }

    try {
      if (editingId) {
        await movieService.updateMovie(editingId, payload);
      } else {
        await movieService.createMovie(payload);
      }
      resetForm();
      await loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save movie.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await movieService.deleteMovie(id);
      if (selectedMovie?.id === id) setSelectedMovie(null);
      await loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete movie.');
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Movies</h1>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-6 text-slate-500">Loading movies...</div>
            ) : movies.length === 0 ? (
              <div className="p-6 text-slate-500">No movies available.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{movie.title}</td>
                      <td className="px-4 py-3">{movie.genre}</td>
                      <td className="px-4 py-3">{movie.status}</td>
                      <td className="space-x-2 px-4 py-3">
                        <button type="button" onClick={() => setSelectedMovie(movie)} className="text-sky-600 hover:underline">View</button>
                        <button type="button" onClick={() => handleEdit(movie)} className="text-indigo-600 hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(movie.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-4">
            {selectedMovie && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold">Movie Details</h2>
                <dl className="mt-3 space-y-2 text-sm text-slate-600">
                  <div><dt className="font-medium text-slate-800">Title</dt><dd>{selectedMovie.title}</dd></div>
                  <div><dt className="font-medium text-slate-800">Language</dt><dd>{selectedMovie.language}</dd></div>
                  <div><dt className="font-medium text-slate-800">Duration</dt><dd>{selectedMovie.duration} mins</dd></div>
                  <div><dt className="font-medium text-slate-800">Status</dt><dd>{selectedMovie.status}</dd></div>
                  <div><dt className="font-medium text-slate-800">Description</dt><dd>{selectedMovie.description}</dd></div>
                </dl>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Movie' : 'Add Movie'}</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
                  <input type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MovieStatus })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="NOW_SHOWING">NOW_SHOWING</option>
                    <option value="ENDED">ENDED</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
                  <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Genre</label>
                  <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Release Date</label>
                <input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">{editingId ? 'Update Movie' : 'Save Movie'}</button>
                <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Clear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
