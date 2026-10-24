export default function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-slate-600">{message}</p>
    </div>
  );
}
