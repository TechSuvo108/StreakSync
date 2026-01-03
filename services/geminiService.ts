import { GoogleGenAI } from "@google/genai";
import { Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to determine model based on complexity, following guidelines
const MODEL_NAME = 'gemini-3-flash-preview';

export const generateGoalDetails = async (title: string): Promise<{ description: string; why: string }> => {
  if (!process.env.API_KEY) {
    return {
      description: "Commit to this new habit consistently.",
      why: "To become a better version of myself and achieve my potential."
    };
  }

  try {
    const prompt = `
      The user wants to start a new habit/goal: "${title}".
      Generate a realistic, specific Description (what they will do) and a powerful Emotional Anchor ("Why" they are doing it).
      Return ONLY a raw JSON object (no markdown formatting) with keys: "description" and "why".
    `;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const text = response.text || "{}";
    // Clean potential markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(jsonStr);
    
    return {
      description: json.description || "",
      why: json.why || ""
    };
  } catch (error) {
    console.error("Gemini Autofill Error:", error);
    return { description: "", why: "" };
  }
};

export const generateMotivation = async (goal: Goal, userName: string): Promise<string> => {
  if (!process.env.API_KEY) return "Keep pushing forward! You're doing great.";

  try {
    const prompt = `
      You are an empathetic accountability partner. 
      The user, ${userName}, is working on a goal: "${goal.title}".
      Category: ${goal.category}.
      Current streak: ${goal.streakDays} days.
      Their "Why" (emotional anchor): "${goal.why}".
      
      Generate a short, punchy, and emotionally resonant motivational message (max 2 sentences) 
      to encourage them to complete their task today. Acknowledge their streak.
      Make it unique and fresh. Random seed: ${Date.now()}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Consistency is key! You got this.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Remember why you started. Keep the streak alive!";
  }
};

export const suggestCommunityName = async (goalTitle: string, description: string): Promise<string> => {
    if (!process.env.API_KEY) return "Goal Achievers";

    try {
        const prompt = `
            Suggest a creative, short (max 3 words) community name for people working on this goal:
            Title: ${goalTitle}
            Description: ${description || "General goal"}
            Return only the name.
        `;
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text?.trim() || "Dedicated Achievers";
    } catch (e) {
        return "Goal Setters";
    }
}