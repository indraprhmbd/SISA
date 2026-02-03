"use client";

import { UserIngredient } from "../lib/engine";

export default function ConfirmationStep({
  ingredients,
  onConfirm,
  onCancel,
  onUpdate,
}: {
  ingredients: UserIngredient[];
  onConfirm: () => void;
  onCancel: () => void;
  onUpdate: (ingredients: UserIngredient[]) => void;
}) {
  const removeItem = (index: number) => {
    onUpdate(ingredients.filter((_, i) => i !== index));
  };

  const updateWeight = (index: number, weight: number) => {
    const updated = [...ingredients];
    updated[index].amount_grams = weight;
    onUpdate(updated);
  };

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Detected Items
          </h2>
          <span className="text-[10px] font-bold text-zinc-300">
            Scanned via Logic
          </span>
        </div>

        <div className="space-y-1">
          {ingredients.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 py-3 border-b border-zinc-50 font-numeric"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...ingredients];
                    updated[index].name = e.target.value;
                    onUpdate(updated);
                  }}
                  className="w-full font-bold text-zinc-800 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={item.amount_grams}
                  onChange={(e) =>
                    updateWeight(index, parseInt(e.target.value) || 0)
                  }
                  className="w-16 px-1 py-1 text-right border-b border-transparent focus:border-zinc-300 rounded-none text-zinc-500 font-bold focus:outline-none"
                />
                <span className="text-[10px] font-bold text-zinc-300 uppercase">
                  g
                </span>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-[10px] font-bold text-zinc-300 hover:text-zinc-900 uppercase tracking-tighter ml-2"
              >
                Remove
              </button>
            </div>
          ))}

          {ingredients.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium italic">
              No items detected.
            </div>
          )}
        </div>

        <button
          onClick={() =>
            onUpdate([...ingredients, { name: "Item", amount_grams: 100 }])
          }
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 block pt-2"
        >
          + Add Item
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onConfirm}
          disabled={ingredients.length === 0}
          className="w-full py-4 bg-zinc-900 text-white font-bold rounded-md transition-none uppercase tracking-wider text-sm"
        >
          Confirm & Decide
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2 text-zinc-400 hover:text-zinc-600 font-bold text-[10px] uppercase tracking-widest"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
