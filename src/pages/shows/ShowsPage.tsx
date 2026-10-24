import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { showService } from '../../services/showService';
import type { Show } from '../../types';
import ShowCard from '../../components/shows/ShowCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await showService.getAll();
        setShows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load shows.');
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, []);

  if (loading) return <PublicLayout><LoadingSpinner label="Loading shows..." /></PublicLayout>;
  if (error) return <PublicLayout><ErrorMessage message={error} /></PublicLayout>;

  return (
    <PublicLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Shows</h1>
        {shows.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {shows.map((show) => <ShowCard key={show.id} show={show} />)}
          </div>
        ) : (
          <EmptyState title="No shows found." message="Please check back later for new screenings." />
        )}
      </div>
    </PublicLayout>
  );
}
