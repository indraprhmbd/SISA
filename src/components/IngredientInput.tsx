"use client";

import { useState, useRef } from "react";

export default function IngredientInput({
  onProcess,
}: {
  onProcess: (
    text: string,
    image?: { data: string; type: string },
  ) => Promise<void>;
}) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    await onProcess(input);
    setIsProcessing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const commaIndex = base64Data.indexOf(",");
      const data = base64Data.substring(commaIndex + 1);

      await onProcess("Image identified ingredients", {
        data,
        type: file.type,
      });
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const startVoiceInput = () => {
    console.log("SISA: Starting voice input attempt...");
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SISA: SpeechRecognition not supported in this browser.");
      alert("Voice input not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Support both English and Indonesian for broader hackathon appeal
      recognition.lang = navigator.language.startsWith("id")
        ? "id-ID"
        : "en-US";
      console.log(`SISA: Recognition lang set to ${recognition.lang}`);

      recognition.onstart = () => {
        console.log("SISA: Recognition started");
        setIsProcessing(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("SISA: Recognition result:", transcript);
        setInput(transcript);
        setIsProcessing(false);
      };

      recognition.onerror = (event: any) => {
        console.error("SISA: Recognition error:", event.error);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        console.log("SISA: Recognition ended");
        setIsProcessing(false);
      };

      recognition.start();
    } catch (err) {
      console.error("SISA: Recognition failed to start:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Available Ingredients
        </label>
        <textarea
          className="w-full min-h-[160px] p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-zinc-400 outline-none resize-none text-zinc-800 placeholder:text-zinc-400 font-medium"
          placeholder="List ingredients here (e.g. 2 eggs, 100g chicken breast)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isProcessing}
          className="w-full py-4 bg-zinc-900 disabled:bg-zinc-200 text-white font-bold rounded-md transition-none flex items-center justify-center uppercase tracking-wider text-sm"
        >
          {isProcessing ? "Processing..." : "Analyze Protein"}
        </button>

        <div className="flex justify-between items-center px-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600"
          >
            Upload Photo
          </button>
          <button
            type="button"
            onClick={startVoiceInput}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600"
          >
            Voice Input
          </button>
        </div>
      </div>
    </div>
  );
}
