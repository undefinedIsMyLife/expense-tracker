import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

/**
 * 🧠 Clean AI response (IMPORTANT FIX)
 */
const cleanJSON = (text) => {
  if (!text) return null;

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

/**
 * 🔹 Utility: Clean description
 */
const cleanDescription = (desc = "") => {
  return desc
    .replace(/paid to|payment to|received from/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Single transaction parser
 */
export const parseTransactionWithHuggingFace = async (text) => {
  try {
    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen3-Coder-Next",
      messages: [
        {
          role: "system",
          content:
            "Return ONLY valid JSON. No markdown. Format: { description, amount, category, date }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.1,
    });

    let content = completion.choices[0].message.content;

    content = cleanJSON(content);
    const parsed = JSON.parse(content);
    if (parsed.description) {
      parsed.description = cleanDescription(parsed.description);
    }

    return parsed;
  } catch (error) {
    console.error("Single Parsing Error:", error.message);
    return null;
  }
};

/**
 * Batch parser 
 */
export const parseBatchWithHuggingFace = async (texts) => {
  if (!texts || texts.length === 0) return [];

  try {
    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen3-Coder-Next",
      messages: [
        {
          role: "system",
          content: `
                Return ONLY valid JSON.
                Do NOT use markdown or backticks.

                Format:
                {
                  "transactions": [
                    {
                      "description": "string",
                      "amount": number,
                      "category": "string",
                      "date": "YYYY-MM-DD"
                    }
                  ]
                }`,
        },
        {
          role: "user",
          content: texts.join("\n"),
        },
      ],
      temperature: 0.1,
    });

    let content = completion.choices[0].message.content;

    content = cleanJSON(content);

    const result = JSON.parse(content);
    
    return Array.isArray(result.transactions) ? result.transactions.map(t => {
      if (t.description) {
        t.description = cleanDescription(t.description);
      }
      return t;
    }) : [];

    
  } catch (error) {
    console.error("Batch Parsing Error:", error.message);
    return [];
  }
};