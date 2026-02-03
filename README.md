# SISA — AI Nutrition Decision Engine

**SISA** (meaning "Leftovers" in Indonesian) is a focused hackathon MVP designed to solve a single problem: **"What can I cook right now to meet my protein needs with the ingredients I have?"**

It follows a "Calm, Fast, Honest" philosophy—no health gamification, no flashy animations, just scannable decisions for a tired, hungry user.

---

## 🚀 Core Principles

1.  **Decision Engine > LLM**: The LLM is used only for **input parsing** (vision/text) and **menu formatting**. All nutritional math and ingredient optimization are handled by a deterministic logic engine.
2.  **Stateless**: No databases, no authentication, no bloat.
3.  **Protein-First**: Prioritizes protein fulfillment as the primary optimization metric.
4.  **Calm UI**: Zero emojis, neutral palette (Zinc/Slate), and tabular typography for clear decision-making.

## 🛠️ Features

- **Multimodal Input**: Input ingredients via **Text**, **Voice** (Web Speech API), or **Photo** (Gemini Vision).
- **The Correction Loop**: Users verify the LLM's ingredient extraction before any math is executed.
- **Protein Gap Analysis**: Deterministic calculation of current protein vs. daily target.
- **Intelligent Suggestions**: Suggests exactly one common ingredient (e.g., "Add 2 Eggs") to close the nutritional gap by at least 20%.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini 3 (Multimodal)
- **Styling**: Tailwind CSS (Neutral Design System)
- **Logic**: Pure TypeScript Decision Engine

---

## 🚦 Getting Started

### 1. Prerequisites

- Node.js 20+
- A Gemini API Key (get it free at [Google AI Studio](https://aistudio.google.com/))

### 2. Setup

```bash
git clone <your-repo>
cd sisa
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
```

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start deciding.

---

## 📂 Project Structure

- `src/lib/engine.ts`: The deterministic nutrition logic.
- `src/app/actions.ts`: Server-side LLM orchestration.
- `src/components/`: Utilitarian UI components (Decision View, Input, Confirmation).
- `src/data/ingredients.json`: Static database of common ingredient protein values.

---

_Built with focus for the [Hackathon Name] MVP._
