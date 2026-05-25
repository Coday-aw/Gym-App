import { Set } from "../lib/types";
import Label from "./Label";

type SetFormProps = {
  sets: Set[];
  onAdd: () => void;
  onRemove: (setId: number) => void;
  onUpdate: (setId: number, updated: Partial<Set>) => void;
};

const SetsForm = ({ sets, onAdd, onRemove, onUpdate }: SetFormProps) => {
  return (
    <div className="space-y-3">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_1fr_44px] gap-3 px-1">
        <Label htmlFor="weights">Weight (kg)</Label>
        <Label htmlFor="reps">Reps</Label>
        <span />
      </div>

      {sets.map((set, index) => (
        <div
          key={set.id}
          className="grid grid-cols-[1fr_1fr_44px] gap-3 items-center animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="relative">
            <input
              type="number"
              min={0}
              max={1000}
              value={set.weight === 0 ? "" : set.weight}
              onChange={(e) =>
                onUpdate(set.id, { weight: Number(e.target.value) })
              }
              placeholder="0"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-base font-medium placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              value={set.reps === 0 ? "" : set.reps}
              onChange={(e) =>
                onUpdate(set.id, { reps: Number(e.target.value) })
              }
              placeholder="0"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white text-base font-medium placeholder:text-slate-600 focus:border-emerald-500/50 transition-all"
            />
          </div>
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200 active:scale-90 cursor-pointer"
            onClick={() => onRemove(set.id)}
            aria-label="Remove set"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-2.5 rounded-lg border border-dashed border-slate-700/50 text-sm font-medium hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5 transition-all duration-200 cursor-pointer mt-1"
      >
        + Add Set
      </button>
    </div>
  );
};

export default SetsForm;
