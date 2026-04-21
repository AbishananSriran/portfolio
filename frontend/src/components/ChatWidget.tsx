import { LucideArrowUp, LucideLoaderCircle } from "lucide-react";
import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { TypewriterMessage } from "./TypeWriterMessage";
import { API_URL } from "@/config";
import { useToast } from "@/hooks/use-toast"; 
import { PRIORITY_QUESTIONS, SECONDARY_QUESTIONS, PRELOADED_ANSWERS, getRelevantQuestions } from "@/lib/search";

const ERROR_MESSAGE = "Sorry, something went wrong. Please try again later.";

export default function ChatWidget() {
  // States
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Ask me anything about Abishanan!", animated: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverSend, setHoverSend] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Refs
  const { toast } = useToast();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (input) {
        setSuggestedQuestions(getRelevantQuestions(input));
    } else if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].animated) {
        const shuffled = [...SECONDARY_QUESTIONS].sort(() => 0.5 - Math.random());
        const extra = shuffled.slice(0, 4); // pick 4 random ones

        setSuggestedQuestions([PRIORITY_QUESTIONS[Math.floor(Math.random() * PRIORITY_QUESTIONS.length)], ...extra]);

        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages, input]);

  const handleExampleClick = (question: string) => {
    if (loading) return;
    const reply = PRELOADED_ANSWERS[question] || ERROR_MESSAGE;

    setLoading(true);
    setMessages((prev) => [
        ...prev,
        { role: "user", content: question, animated: true },
        { role: "assistant", content: reply, animated: false }
    ]);
  };


  const sendMessage = async () => {
    if (!input || loading) return;

    setLoading(true);
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

        if (res.ok) {
            // replace loading message with real response
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: data.reply || ERROR_MESSAGE,
                    animated: false,
                };
                return updated;
            });
        } else {
            toast({
                title: "Error",
                description: "Failed to get response from assistant: " + res.statusText,
                variant: "destructive"
            });

            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: ERROR_MESSAGE,
                    animated: false,
                };
                return updated;
            });
        }

    } catch (err) {
        toast({
            title: "Error",
            description: "Failed to get response from assistant: " + err.message,
            variant: "destructive"
        });

        setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
                role: "assistant",
                content: ERROR_MESSAGE,
                animated: false,
            };
            return updated;
        });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 blur-lg opacity-70 animate-pulse" />

            <button
                onClick={() => setOpen(true)}
                className="bg-white text-black px-4 py-2 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
            >
                <FaUserTie className="animate-pulse w-5 h-6" />
            </button>
        </div>
      )}

      {open && (
        <div className="w-80 h-96 bg-background border border-border rounded-xl flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-300/70 via-blue-400 to-fuchsia-400/80 rounded-t-xl text-white shadow-sm">
            <div className="flex items-center gap-2">
                <FaUserTie className="w-5 h-5" />
                <span className="font-semibold text-sm">Abi AI</span>
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
                                    onUpdate={() =>
                                        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    onDone={() => {
                                        setMessages((prev) =>
                                            prev.map((msg, idx) =>
                                                idx === i ? { ...msg, animated: true } : msg
                                            )
                                        );

                                        setLoading(false);
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
            
            {(!messages.length || (messages[0].role === "user" || (messages[0].role === "assistant" && messages[0].animated))) && (
                <div className="px-3 py-2 overflow-x-auto">
                    <div className="flex gap-2 w-max">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleExampleClick(q)}
                                className="text-xs bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
                    className={`p-2 bg-blue-400 ${!loading && "hover:bg-white"} text-white rounded-full shadow-md transition flex items-center justify-center`}
                    onMouseEnter={() => setHoverSend(true)}
                    onMouseLeave={() => setHoverSend(false)}
                    disabled={loading}
                >
                    {loading ? (
                        <LucideLoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                        <LucideArrowUp className={`w-4 h-4${hoverSend ? ' text-blue-400' : ''}`} />
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}