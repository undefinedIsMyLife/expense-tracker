import dotenv from "dotenv";
import { parseTransactionWithHuggingFace } from "./GeminiService.js";

dotenv.config();

const test = async () => {

  console.log("Testing Hugging Face...");


  const text = "Paid to NETFLIX subscription ₹199 on Mar 23, 2026";

  const result = await parseTransactionWithHuggingFace(text);

  console.log("Result:");
  console.dir(result, { depth: null });
};

test();