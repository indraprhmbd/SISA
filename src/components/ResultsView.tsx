"use client";

import { ProcessedResult } from "../app/actions";

export default function ResultsView({
  result,
  onReset,
}: {
  result: ProcessedResult;
  onReset: () => void;
}) {
  const { gap, improvement, menu, reasoning } = result;

  return (
    <div className="w-full space-y-12">
      {/* Result Section */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Recommended Decision
        </h2>
        <div className="text-3xl font-black text-zinc-900 leading-tight">
          {menu}
        </div>
        <div className="p-4 bg-zinc-50 border-l-2 border-zinc-900 text-sm text-zinc-600 leading-relaxed font-medium">
          {reasoning}
        </div>
      </div>

      {/* Protein Context */}
      <div className="space-y-4 pt-8 border-t border-zinc-100">
        <div className="flex justify-between items-baseline">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Protein Context
          </h3>
          <span className="font-numeric font-black text-2xl text-zinc-900">
            ~{gap.percent_fulfilled}% fulfilled
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-none overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-none"
            style={{ width: `${gap.percent_fulfilled}%` }}
          />
        </div>
      </div>

      {/* Suggestion Section */}
      {improvement && (
        <div className="p-6 border border-zinc-200 rounded-lg space-y-3">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Optimization Suggestion
          </h3>
          <p className="text-sm font-bold text-zinc-800 leading-snug">
            Add {improvement.amount_needed}g of {improvement.ingredient.name} to
            improve gap by ≥{improvement.gap_improvement_percent}%.
          </p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-4 text-zinc-400 hover:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] transition-none border-t border-zinc-50 mt-8"
      >
        Reset System
      </button>
    </div>
  );
}
