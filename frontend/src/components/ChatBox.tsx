import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatBox() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! Ask anything about your uploaded documents.",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
      {
        sender: "ai",
        text: "Thinking...",
      },
    ]);

    setMessage("");
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-2xl h-[520px] flex flex-col">

      <div className="p-5 border-b border-white/10">

        <h2 className="text-xl text-white font-bold">
          AI Chat
        </h2>

      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.sender === "user"
                ? "bg-indigo-600 ml-auto text-white"
                : "bg-white/10 text-gray-200"
            }`}
          >
            {msg.text}
          </div>

        ))}

      </div>

      <div className="border-t border-white/10 p-4 flex gap-3">

        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Ask AI..."
          className="flex-1 bg-[#1F2937] rounded-xl px-4 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-xl px-5"
        >
          <Send className="text-white"/>
        </button>

      </div>

    </div>
  );
}