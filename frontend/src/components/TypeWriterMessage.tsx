import { useEffect, useState } from "react";
import GraphemeSplitter from "grapheme-splitter";
import ThinkingDots from "./ThinkingDots";

export function TypewriterMessage({
  text,
  animated,
  onDone,
  onUpdate,
}: {
  text: string;
  animated: boolean;
  onDone?: () => void;
  onUpdate?: () => void;
}) {
  const [displayed, setDisplayed] = useState(animated ? text : "");
  const [thinking, setThinking] = useState(!animated);

  useEffect(() => {
    if (animated) return; // ✅ skip if already played

    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(text);

    // 👇 thinking delay
    const thinkingTimeout = setTimeout(() => {
      setThinking(false);

      let i = 0;

      const interval = setInterval(() => {
        setDisplayed(graphemes.slice(0, i + 1).join(""));
        i++;

        onUpdate?.(); // scroll

        if (i >= graphemes.length) {
          clearInterval(interval);
          onDone?.(); // ✅ mark as finished
        }
      }, 15);

    }, 600);

    return () => clearTimeout(thinkingTimeout);
  }, [text, animated]);

  if (thinking) return <ThinkingDots />;

  return <div className="animate-fadeIn">{displayed}</div>;
}