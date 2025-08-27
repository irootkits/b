import fs from "fs";
import path from "path";

const dbPath = path.join("/tmp", "users.json"); 

export async function handler(event) {
  const { email, password, mode, code } = JSON.parse(event.body || "{}");

  // Charger la base
  let users = [];
  if (fs.existsSync(dbPath)) {
    users = JSON.parse(fs.readFileSync(dbPath));
  }

  if (mode === "signup") {
    if (users.find((u) => u.email === email)) {
      return { statusCode: 200, body: JSON.stringify({ success: false, message: "Déjà inscrit" }) };
    }
    users.push({ email, password });
    fs.writeFileSync(dbPath, JSON.stringify(users));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  if (mode === "login") {
    const ok = users.find((u) => u.email === email && u.password === password);
    return { statusCode: 200, body: JSON.stringify({ success: !!ok, message: ok ? "" : "Erreur login" }) };
  }

  if (mode === "admin") {
    if (code === process.env.ADMIN_CODE) {
      return { statusCode: 200, body: JSON.stringify({ success: true, users }) };
    } else {
      return { statusCode: 200, body: JSON.stringify({ success: false }) };
    }
  }

  return { statusCode: 400, body: "Bad request" };
}

