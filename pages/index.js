import { useState } from "react";
import Router from "next/router";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); 
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/.netlify/functions/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, mode }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify({ email }));
      Router.push("/chat");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "login" ? "Connexion" : "Inscription"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {mode === "login" ? "Se connecter" : "Creer un compte"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="mt-4 text-blue-700 underline"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Creer un compte" : "Deja inscrit ?"}
      </button>
    </div>
  );
}
