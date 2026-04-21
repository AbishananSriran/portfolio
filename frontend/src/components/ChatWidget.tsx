import { LucideArrowUp } from "lucide-react";
import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { TypewriterMessage } from "./TypeWriterMessage";
import { API_URL } from "@/config";
import { useToast } from "@/hooks/use-toast"; 
import { get } from "http";

const ERROR_MESSAGE = "Sorry, something went wrong. Please try again later.";

const PRIORITY_QUESTIONS = [
  "Tell me about his experience at Shopify.",
  "What kind of engineer is he?",
  "Has he worked on large-scale systems?",
  "What projects has he built?",
  "Does he have experience with AI or machine learning?",
  "What did he do at Roblox?"
];

const STOPWORDS = new Set([
  "the", "is", "at", "which", "on", "a", "an", "and", "or",
  "of", "to", "in", "for", "with", "about", "does", "has",
  "have", "he", "it", "his", "her", "what", "tell",
  "me", "can", "you"
]);

const KEYWORD_WEIGHTS = {
  shopify: 10,
  cibc: 10,
  roblox: 10,
  ai: 4,
  machine: 4,
  learning: 4,
  systems: 4,
  distributed: 4,
  backend: 3,
  cloud: 3,
  projects: 3,
  skills: 2,
  languages: 2,
  contact: 3
};

const SECONDARY_QUESTIONS = [
  "Who is Abishanan?",
  "What is Abishanan studying?",
  "When is his graduation?",
  "What are his main technical skills?",
  "What programming languages does he know?",
  "What cloud technologies has he worked with?",
  "What did he do at CIBC?",
  "What is Chef’s Pic?",
  "What is ASLingo?",
  "What kind of backend systems has he built?",
  "Does he have experience with distributed systems?",
  "What are his interests outside of coding?",
  "Has he done any teaching or mentorship?",
  "How can I contact him?"
];

const EXAMPLE_QUESTIONS = [...PRIORITY_QUESTIONS, ...SECONDARY_QUESTIONS];

const PRELOADED_ANSWERS = {
  "Who is Abishanan?": "Abishanan Sriranjan is a software engineer focused on large-scale distributed systems, backend infrastructure and AI-integrated applications. He has worked on production systems operating at global scale and is particularly interested in building reliable, high-performance systems.",
  "What is Abishanan studying?": "He is pursuing a BSc in Computer Science at Toronto Metropolitan University, maintaining a strong academic record (CGPA 4.06/4.33) with a focus on systems, AI and low-level computing.",
  "When is his graduation?": "He is expected to graduate in June 2026.",
  "What kind of engineer is he?": "He is a systems-oriented engineer specializing in distributed systems, backend infrastructure and reliability engineering, with additional experience building full-stack and AI-powered applications.",
  "What are his main technical skills?": "His core strengths include distributed systems design, backend API development, cloud infrastructure across AWS, Azure and GCP, and integrating machine learning and computer vision into real-world applications.",
  "What programming languages does he know?": "He works across a wide range of languages including Python, Java, C#, C/C++, JavaScript, TypeScript, Go, Rust and SQL, allowing him to operate across both systems-level and application-level development.",
  "What cloud technologies has he worked with?": "He has experience with AWS, Azure and GCP, along with Docker, GitHub Actions and cloud-native deployment pipelines focused on scalability and reliability.",
  "Tell me about his experience at Shopify.": "At Shopify, he worked on critical infrastructure including a Web Application Firewall handling over 100 million requests per minute. He contributed to a circuit breaker system used by 230+ organizations and worked on global networking systems spanning 175+ countries. He also served as an on-call Site Reliability Engineer, handling real production incidents and focusing on resiliency engineering.",
  "What did he do at CIBC?": "At CIBC, he designed and built an Azure-based data migration and validation pipeline, reducing testing time by approximately 12x through automation. He worked with large-scale datasets using Python, SQL and PySpark and built systems for data transformation and validation.",
  "What did he do at Roblox?": "At Roblox, he built large-scale game systems using Lua, writing around 10,000 lines of production code. He designed networking and data systems, and the game reached approximately 6,000 users. This experience built his early foundation in real-time systems and scalable architecture.",
  "What projects has he built?": "He has built AI applications, backend systems and full-stack platforms including Chef’s Pic, ASLingo, DataCent and Convoisseur. Earlier, he also developed large-scale game systems on Roblox that reached thousands of users, contributing to his foundation in real-time and networked systems.",
  "Does he have experience with AI or machine learning?": "Yes, he has built AI and computer vision systems using tools like Gemini, OpenCV and MediaPipe, focusing on integrating machine learning into real-time, production-ready applications.",
  "What is Chef’s Pic?": "Chef’s Pic is an AI-powered application that uses computer vision to recognize food and generate detailed dietary breakdowns, combining machine learning with a full-stack mobile system.",
  "What is ASLingo?": "ASLingo is a computer vision-based platform for learning American Sign Language, using real-time gesture recognition to create an interactive and feedback-driven learning experience.",
  "Has he worked on large-scale systems?": "Yes, particularly at Shopify where he worked on infrastructure handling extremely high request volumes. Earlier, at Roblox, he built real-time game systems used by thousands of users. His experience spans both high-throughput backend systems and interactive distributed environments.",
  "What kind of backend systems has he built?": "He has built APIs, distributed services, data pipelines and validation systems using frameworks like FastAPI and Flask, with a focus on scalability, correctness and performance.",
  "Does he have experience with distributed systems?": "Yes, distributed systems are a core focus area, including designing scalable architectures, handling failure scenarios and ensuring system reliability under high load.",
  "What are his interests outside of coding?": "Outside of engineering, he is involved in soccer, dragonboating and competitive programming, and enjoys traveling and exploring new places.",
  "Has he done any teaching or mentorship?": "Yes, he has worked as a teaching assistant supporting 20–50+ students and has presented technical work to audiences ranging from small teams to hundreds of engineers.",
  "How can I contact him?": "You can reach him via email at contact@abi.gg or connect with him on GitHub and LinkedIn."
};

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

  const tokenize = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // remove punctuation
        .split(/\s+/)
        .filter((word: string) => word && !STOPWORDS.has(word));
  };
  const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, "");

  const getRelevantQuestions = (input: string) => {
    const tokens = tokenize(input);

    const scored = EXAMPLE_QUESTIONS.map((q) => {
        const qTokens = tokenize(q);

        let score = 0;

        tokens.forEach((word) => {
            // exact match boost
            if (qTokens.includes(word)) {
                score += KEYWORD_WEIGHTS[word] || 1;
            }

            // partial match (handles "shop" → "shopify")
            qTokens.forEach((qt) => {
                const cleanWord = normalize(word);

                if (qt.includes(cleanWord) || cleanWord.includes(qt)) {
                    score += 0.5;
                }
            });
        });

        return { question: q, score };
    });

    return scored
        .filter((q) => q.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((q) => q.question);
 };

  useEffect(() => {
    if (input) {
        setSuggestedQuestions(getRelevantQuestions(input));
    } else if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && messages[messages.length - 1].animated) {
        const shuffled = [...SECONDARY_QUESTIONS].sort(() => 0.5 - Math.random());
        const extra = shuffled.slice(0, 4); // pick 4 random ones

        setSuggestedQuestions([PRIORITY_QUESTIONS[Math.floor(Math.random() * PRIORITY_QUESTIONS.length)], ...extra]);
    }
  }, [open, messages, input]);

  const handleExampleClick = (question) => {
    if (loading) return;

    const userMessage = { role: "user", content: question, animated: true };

    const reply = PRELOADED_ANSWERS[question] || ERROR_MESSAGE;

    setLoading(true);
    setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "assistant", content: reply, animated: false }
    ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);


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
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/ to-fuchsia-400 blur-lg opacity-70 animate-pulse" />

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
                    className="p-2 bg-blue-400 hover:bg-white text-white rounded-full shadow-md transition flex items-center justify-center"
                    onMouseEnter={() => setHoverSend(true)}
                    onMouseLeave={() => setHoverSend(false)}
                >
                    <LucideArrowUp className={`w-4 h-4${hoverSend ? ' text-blue-400' : ''}`} />
                </button>
                </div>
        </div>
      )}
    </div>
  );
}