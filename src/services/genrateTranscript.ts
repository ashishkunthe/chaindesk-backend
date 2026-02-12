import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTranscript(transcript: string) {
  const prompt = `
Extract action items from the following meeting transcript.

Return ONLY valid JSON.
Do not include explanations.
Format:

[
  {
    "task": "string",
    "owner": "string | null",
    "dueDate": "ISO date string | null",
    "summary": "short summary under 50 chars"
  }
]

Transcript:
${transcript}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You extract structured action items." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  const content = response?.choices[0]?.message.content;

  if (!content) throw new Error("No response from LLM");

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    throw new Error("Failed to parse LLM JSON response");
  }
}
