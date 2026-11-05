"use server";

import { GoogleGenAI } from "@google/genai";

export const requestAiAction = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
  });

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
  });

  return interaction.output_text || "No output generated.";
};
