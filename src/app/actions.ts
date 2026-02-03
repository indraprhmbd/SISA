"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  UserIngredient,
  calculateTotalProtein,
  analyzeProteinGap,
  findImprovement,
  GapResult,
  ImprovementSuggestion,
} from "../lib/engine";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
);

export type ProcessedResult = {
  ingredients: UserIngredient[];
  gap: GapResult;
  improvement: ImprovementSuggestion | null;
  menu: string;
  reasoning: string;
};

/**
 * Real LLM Integration: Parses raw input (text/vision/audio) into ingredients.
 */
export async function parseIngredientsAction(
  rawInput: string,
  imageBase64?: string,
  imageMimeType?: string,
): Promise<UserIngredient[]> {
  // Reverting to 1.5 Flash for the best balance of stability, limits, and compatibility
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a specialized ingredient extractor for SISA. Your goal is to extract a list of ingredients and their estimated weights in grams from the provided input.
  Rules:
  1. Return a JSON array of objects: [{ "name": string, "amount_grams": number }].
  2. Estimate weight reasonably if not specified (e.g., 1 egg = 50g, 1 moderate chicken breast = 150g).
  3. Do NOT calculate protein values.
  4. Only return the JSON array. No other text.
  
  Input: ${rawInput}`;

  try {
    let result;
    if (imageBase64 && imageMimeType) {
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType,
          },
        },
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text();
    // Basic JSON cleaning in case LLM wraps it in markdown blocks
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleanedJson) as UserIngredient[];
  } catch (error) {
    console.error("Gemini Parsing Error in parseIngredientsAction:", error, {
      rawInput,
      imageMimeType,
    });
    // Fallback to basic mock parsing if API fails
    return [{ name: "Unknown Ingredient", amount_grams: 100 }];
  }
}

/**
 * Real LLM Integration: Composes the final menu and reasoning based on deterministic results.
 */
export async function generateDecisionAction(
  ingredients: UserIngredient[],
): Promise<ProcessedResult> {
  const currentProtein = calculateTotalProtein(ingredients);
  const gapResult = analyzeProteinGap(currentProtein);
  const improvement = findImprovement(ingredients, gapResult);

  // Switching to gemini-2.0-flash (stable) for Feb 2026
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a specialized menu composer for SISA. You must compose ONE simple menu and reasoning.
  
  Inputs:
  - User ingredients: ${JSON.stringify(ingredients)}
  - Current Protein Fulfillment: ${gapResult.percent_fulfilled}%
  - Protein Gap: ${gapResult.gap}g
  - Improvement Suggestion: ${improvement ? `${improvement.amount_needed}g of ${improvement.ingredient.name}` : "None"}
  
  Task: 
  1. Compose ONE nutritious menu using the ingredients.
  2. Provide a brief reasoning (2-3 sentences) explaining how this choice addresses the protein gap.
  3. Maintain a calm, neutral, and utilitarian tone. No health advice.
  4. Return the result in JSON: { "menu": string, "reasoning": string }`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const composition = JSON.parse(cleanedJson);

    return {
      ingredients,
      gap: gapResult,
      improvement,
      menu: composition.menu,
      reasoning: composition.reasoning,
    };
  } catch (error) {
    console.error("Gemini Composition Error:", error);
    return {
      ingredients,
      gap: gapResult,
      improvement,
      menu: "Stateless dish based on available protein sources.",
      reasoning:
        "The system provided a deterministic menu fallback due to a composition timeout.",
    };
  }
}
