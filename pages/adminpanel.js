import { useState } from "react";

export default function AdminPanel() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "admin", code }),
    });
    const d = await res.json();
    if (d.success) setData(d.users);
  };

  return (
    <div className="p-6">
      {!data ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="password"
            placeholder="Code admin"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2"
          />
          <button className="bg-red-500 text-white p-2 rounded">
            Accéder
          </button>
        </form>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
