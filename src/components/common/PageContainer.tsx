import type { ReactNode } from 'react';

export default function PageContainer({ title, subtitle, children }: { title?: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <header className="space-y-1">
          {title && <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>}
          {subtitle && <p className="text-slate-600">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
