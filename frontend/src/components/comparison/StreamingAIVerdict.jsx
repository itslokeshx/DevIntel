import React, { useState, useEffect } from "react";

export function StreamingAIVerdict({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 12);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <div className="leading-relaxed text-sm md:text-base">
      {displayedText}
      {currentIndex < (text?.length || 0) && (
        <span className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}
