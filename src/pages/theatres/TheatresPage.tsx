import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { theatreService } from '../../services/theatreService';
import type { Theatre } from '../../types';
import TheatreCard from '../../components/theatres/TheatreCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function TheatresPage() {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await theatreService.getAll();
        setTheatres(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load theatres.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, []);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading theatres..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Theatres</h1>
        {theatres.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {theatres.map((theatre) => <TheatreCard key={theatre.id} theatre={theatre} />)}
          </div>
        ) : (
          <EmptyState title="No theatres found." message="There are no theatres to display right now." />
        )}
      </div>
    </PublicLayout>
  );
}
