import fs from "fs";
import path from "path";

const dbPath = path.join("/tmp", "chat.json");

export async function handler(event) {
  let messages = [];
  if (fs.existsSync(dbPath)) {
    messages = JSON.parse(fs.readFileSync(dbPath));
  }

 
  const now = Date.now();
  messages = messages.filter((m) => now - m.timestamp < 3600000);

  if (event.httpMethod === "POST") {
    const { text, user } = JSON.parse(event.body || "{}");
    messages.push({ text, user, timestamp: now });
    fs.writeFileSync(dbPath, JSON.stringify(messages));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  fs.writeFileSync(dbPath, JSON.stringify(messages));
  return { statusCode: 200, body: JSON.stringify(messages) };
}

