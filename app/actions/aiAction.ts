"use server";

import { GoogleGenAI } from "@google/genai";

const MODELS = ["gemini-3.8-flash"];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);

  return message
    .replace(/^Error \[[^\]]+\]:\s*/, "")
    .replace(/^(429|503)\s*/, "")
    .trim();
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  if ("code" in error && typeof error.code === "number") {
    return error.code;
  }

  return undefined;
};

export const requestAiAction = async (prompt: string) => {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return "Gemini API key is missing. Please check your environment configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });

    let lastError = "";

    // Try primary model and fallback models
    for (const model of MODELS) {
      console.log(`Trying Gemini model: ${model}`);

      // Two attempts for temporary 503 errors
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const interaction = await ai.interactions.create({
            model,
            input: prompt,
          });

          console.log(`Success with model: ${model}`);

          return interaction.output_text || "No output generated.";
        } catch (error: unknown) {
          const message = getErrorMessage(error);
          const status = getErrorStatus(error);

          console.error(`${model} failed:`, message);

          const isQuotaError =
            status === 429 ||
            /\b429\b|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(message);

          const isTemporaryError =
            status === 503 ||
            /\b503\b|UNAVAILABLE|high demand|overloaded/i.test(message);

          lastError = message;

          // Quota exhausted: immediately try next model
          if (isQuotaError) {
            console.log(`${model} quota exceeded. Switching model...`);
            break;
          }

          // Temporary server issue: retry once
          if (isTemporaryError) {
            if (attempt === 0) {
              console.log(`Retrying ${model}...`);
              await wait(1500);
              continue;
            }

            console.log(`${model} unavailable. Switching model...`);
            break;
          }

          // Other errors: don't retry
          return message || "Something went wrong. Please try again.";
        }
      }
    }

    return `All available Gemini models failed. ${lastError || "Please try again later."}`;
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    return getErrorMessage(error) || "Something went wrong. Please try again.";
  }
};
