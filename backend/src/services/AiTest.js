import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const test = async () => {
  try {
    console.log("🚀 Starting AI test...");

    console.log("API KEY:", process.env.OPENROUTER_API_KEY ? "Loaded ✅" : "Missing ❌");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "user",
            content: "Return JSON: {\"message\": \"hello\"}"
          }
        ]
      })
    });

    console.log("📡 Response status:", response.status);

    const data = await response.json();

    console.log("🧠 Full response:");
    console.dir(data, { depth: null });

  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

test();