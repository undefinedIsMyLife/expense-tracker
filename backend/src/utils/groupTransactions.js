export const groupTransactions = (rows) => {
  const grouped = [];
  let current = "";

  for (const row of rows) {
    const text = Object.values(row).join(" ").trim();

    // Detect new transaction (date present)
    if (text.match(/\b[A-Za-z]{3}\s\d{1,2},\s\d{4}/)) {
      if (current) grouped.push(current.trim());
      current = text;
    } else {
      current += " " + text;
    }
  }

  if (current) grouped.push(current.trim());

  return grouped;
};