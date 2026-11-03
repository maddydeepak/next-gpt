"use server";

import { GoogleGenAI } from "@google/genai";

export const requestAiAction = async (prompt: string) => {
  try {
    console.log("🔥 SERVER ACTION CALLED");
    console.log("Prompt:", prompt);

    console.log("API KEY AVAILABLE:", !!process.env.GOOGLE_GEMINI_API_KEY);
    // const ai = new GoogleGenAI({
    //   apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    // });
    console.log("Calling Gemini API...");
    // const interaction = await ai.interactions.create({
    //   model: "gemini-3.8-flash",
    //   input: prompt,
    // });
    // console.log("Gemini response:", interaction);
    return process.env.GOOGLE_GEMINI_API_KEY;
    // return interaction.output_text || "No output generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);

    return "Something went wrong while communicating with Gemini.";
  }
};
