import { useMemo } from 'react';

export interface SeatGridProps {
  availableSeats: string[];
  selectedSeats: string[];
  onToggleSeat: (seat: string) => void;
}

export default function SeatGrid({ availableSeats, selectedSeats, onToggleSeat }: SeatGridProps) {
  const rows = useMemo(() => {
    const seatSet = new Set(availableSeats);
    const selectedSet = new Set(selectedSeats);
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatLayout: string[] = [];

    rowLabels.forEach((row) => {
      for (let i = 1; i <= 8; i++) {
        const seat = `${row}${i}`;
        seatLayout.push(seat);
      }
    });

    return seatLayout.map((seat) => ({
      label: seat,
      available: seatSet.has(seat),
      selected: selectedSet.has(seat),
    }));
  }, [availableSeats, selectedSeats]);

  return (
    <div className="space-y-3">
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-slate-100 p-4">
        <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Screen</div>
        <div className="grid grid-cols-8 gap-2">
          {rows.map((seat) => {
            const disabled = !seat.available;
            const selected = seat.selected;

            return (
              <button
                key={seat.label}
                type="button"
                aria-label={`Seat ${seat.label}`}
                onClick={() => onToggleSeat(seat.label)}
                disabled={disabled}
                className={[
                  'flex h-10 items-center justify-center rounded-md border text-xs font-medium transition',
                  disabled ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-400' : '',
                  selected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-red-400',
                ].join(' ')}
              >
                {seat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-white border border-slate-300" />Available</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-red-600" />Selected</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-200" />Unavailable</span>
      </div>
    </div>
  );
}
