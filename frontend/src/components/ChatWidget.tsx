import { LucideArrowUp } from "lucide-react";
import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { TypewriterMessage } from "./TypeWriterMessage";
import { API_URL } from "@/config";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Ask me anything about Abishanan!", animated: true }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);


  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input, animated: true };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const loadingMessage = {
        role: "assistant",
        content: "...",
        animated: false,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
        const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
        });

        const data = await res.json();

        // replace loading message with real response
        setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
                role: "assistant",
                content: data.reply,
                animated: false,
            };
            return updated;
        });

    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-full shadow-lg"
        >
          <FaUserTie className="animate-pulse w-5 h-6" />
        </button>
      )}

      {open && (
        <div className="w-80 h-96 bg-background border border-border rounded-xl flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl text-white shadow-sm">
            <div className="flex items-center gap-2">
                <FaUserTie className="w-5 h-5" />
                <span className="font-semibold text-sm">Abishanan Assistant</span>
            </div>
            <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-200 transition"
            >
                ✕
            </button>
        </div>
            <div className="flex-1 p-3 overflow-y-auto text-sm space-y-3">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${
                            m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            m.role === "user"
                                ? "bg-white text-black rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                        >
                            {m.role === "assistant" ? (
                                <TypewriterMessage
                                    text={m.content}
                                    animated={m.animated}
                                    onUpdate={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                                    onDone={() => {
                                        setMessages((prev) =>
                                        prev.map((msg, idx) =>
                                            idx === i ? { ...msg, animated: true } : msg
                                        )
                                        );
                                    }}
                                />
                            ) : (
                                m.content
                            )}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t flex items-center gap-2 bg-background rounded-b-xl shadow-inner">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-400 transition"
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition flex items-center justify-center"
                >
                    <LucideArrowUp className="w-4 h-4" />
                </button>
                </div>
        </div>
      )}
    </div>
  );
}