import ingredientsData from "../data/ingredients.json";

export type Ingredient = {
  name: string;
  protein_per_100g: number;
  is_common: boolean;
  category: "animal" | "plant";
};

export type UserIngredient = {
  name: string;
  amount_grams: number;
};

export type GapResult = {
  current_protein: number;
  target_protein: number;
  gap: number;
  percent_fulfilled: number;
};

export type ImprovementSuggestion = {
  ingredient: Ingredient;
  amount_needed: number;
  gap_improvement_percent: number;
};

/**
 * DETERMINISTIC ENGINE RULES:
 * 1. Calculate total protein from provided ingredients.
 * 2. Compare against a conservative target (default 50g for MVP).
 * 3. Suggest exactly ONE ingredient to close the gap by at least 20%.
 */

export function calculateTotalProtein(
  userIngredients: UserIngredient[],
): number {
  return userIngredients.reduce((total, userIng) => {
    const baseIng = ingredientsData.find(
      (ing) => ing.name.toLowerCase() === userIng.name.toLowerCase(),
    );
    if (!baseIng) return total;
    return total + (baseIng.protein_per_100g * userIng.amount_grams) / 100;
  }, 0);
}

export function analyzeProteinGap(
  current: number,
  target: number = 50,
): GapResult {
  const gap = Math.max(0, target - current);
  const percent_fulfilled = Math.min(100, Math.round((current / target) * 100));

  return {
    current_protein: Math.round(current * 10) / 10,
    target_protein: target,
    gap: Math.round(gap * 10) / 10,
    percent_fulfilled,
  };
}

export function findImprovement(
  userIngredients: UserIngredient[],
  gapResult: GapResult,
): ImprovementSuggestion | null {
  if (gapResult.gap <= 0) return null;

  // Find a common ingredient that can reduce the gap by at least 20%
  // 20% of the target protein
  const improvementThreshold = gapResult.target_protein * 0.2;

  // Filter to common ingredients not already in the user's list (simplified)
  const candidates = (ingredientsData as Ingredient[]).filter(
    (ing) =>
      ing.is_common &&
      !userIngredients.some(
        (ui) => ui.name.toLowerCase() === ing.name.toLowerCase(),
      ),
  );

  for (const candidate of candidates) {
    // How much of this ingredient brings us 20% closer?
    // amount = (threshold / protein_per_100g) * 100
    const amountNeeded = Math.round(
      (improvementThreshold / candidate.protein_per_100g) * 100,
    );

    // Suggest a reasonable portion (e.g., between 50g and 200g)
    if (amountNeeded >= 50 && amountNeeded <= 200) {
      return {
        ingredient: candidate,
        amount_needed: amountNeeded,
        gap_improvement_percent: 20,
      };
    }
  }

  return null;
}
