import { useState, useEffect } from "react";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) window.location.href = "/";
    else setUser(JSON.parse(stored));

    
    fetch("/.netlify/functions/chat")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, user: user.email }),
    });
    setMessage("");
    const res = await fetch("/.netlify/functions/chat");
    setMessages(await res.json());
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Chat Global</h1>
      <div className="border p-4 h-64 overflow-y-scroll mb-4">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.user}:</b> {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Écrire un message..."
        />
        <button className="bg-green-500 text-white p-2 rounded">Envoyer</button>
      </form>
    </div>
  );
}
