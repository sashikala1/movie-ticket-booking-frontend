import type { ReactNode } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
