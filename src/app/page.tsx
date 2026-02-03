"use client";

import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import ConfirmationStep from "@/components/ConfirmationStep";
import ResultsView from "@/components/ResultsView";
import { UserIngredient } from "@/lib/engine";
import {
  parseIngredientsAction,
  generateDecisionAction,
  ProcessedResult,
} from "./actions";

type AppState = "INPUT" | "CONFIRM" | "RESULT";

export default function Home() {
  const [state, setState] = useState<AppState>("INPUT");
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [result, setResult] = useState<ProcessedResult | null>(null);

  const handleInputProcess = async (
    text: string,
    image?: { data: string; type: string },
  ) => {
    let detected;
    if (image) {
      detected = await parseIngredientsAction(text, image.data, image.type);
    } else {
      detected = await parseIngredientsAction(text);
    }
    setIngredients(detected);
    setState("CONFIRM");
  };

  const handleConfirm = async () => {
    if (result) return;
    const finalResult = await generateDecisionAction(ingredients);
    setResult(finalResult);
    setState("RESULT");
  };

  const resetAll = () => {
    setState("INPUT");
    setIngredients([]);
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-white py-16 px-6 md:py-32">
      <div className="max-w-lg mx-auto space-y-20">
        {/* Minimal Branding */}
        <header className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
            SISA
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
            Decision System
          </p>
        </header>

        {/* View Layout */}
        <div className="relative">
          {state === "INPUT" && (
            <div className="space-y-4">
              <IngredientInput onProcess={handleInputProcess} />
            </div>
          )}

          {state === "CONFIRM" && (
            <ConfirmationStep
              ingredients={ingredients}
              onUpdate={setIngredients}
              onConfirm={handleConfirm}
              onCancel={resetAll}
            />
          )}

          {state === "RESULT" && result && (
            <ResultsView result={result} onReset={resetAll} />
          )}
        </div>

        {/* Utilitarian Footer */}
        <footer className="pt-12 border-t border-zinc-50">
          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
            Stateless • Calculated Protein • Deterministic
          </p>
        </footer>
      </div>
    </main>
  );
}
