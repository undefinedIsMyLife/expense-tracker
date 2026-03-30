export const fallbackParser = (text) => {
  const lower = text.toLowerCase();

  let category = "misc";
  let type = "expense";

  if (lower.includes("received") || lower.includes("credited")) {
    type = "income";
  }

  if (lower.includes("netflix") || lower.includes("spotify")) {
    category = "entertainment";
  } else if (
    lower.includes("pani puri") ||
    lower.includes("dairy") ||
    lower.includes("snacks")
  ) {
    category = "food";
  } else if (lower.includes("railway") || lower.includes("bus")) {
    category = "transport";
  } else if (lower.includes("recharge") || lower.includes("airtel")) {
    category = "utilities";
  } else if (lower.includes("amazon") || lower.includes("flipkart")) {
    category = "shopping";
  }

  return {
    description: text,
    amount: null,
    type,
    category,
    date: null
  };
};