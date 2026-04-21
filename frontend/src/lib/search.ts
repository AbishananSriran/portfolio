export const PRIORITY_QUESTIONS = [
  "Tell me about his experience at Shopify.",
  "What kind of engineer is he?",
  "Has he worked on large-scale systems?",
  "What projects has he built?",
  "Does he have experience with AI or machine learning?",
  "What did he do at Roblox?"
];

export const SECONDARY_QUESTIONS = [
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

export const PRELOADED_ANSWERS = {
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


const tokenize = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // remove punctuation
        .split(/\s+/)
        .filter((word: string) => word && !STOPWORDS.has(word));
};
const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, "");

export const getRelevantQuestions = (input: string) => {
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