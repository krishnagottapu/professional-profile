"use client";

import { useState, useEffect, useCallback } from "react";

interface TypingAnimationProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingAnimation({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: TypingAnimationProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tick = useCallback(() => {
    const fullPhrase = phrases[currentPhraseIndex];

    if (isPaused) {
      return;
    }

    if (!isDeleting) {
      // Typing forward
      const nextText = fullPhrase.slice(0, currentText.length + 1);
      setCurrentText(nextText);

      if (nextText === fullPhrase) {
        // Phrase complete — pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      const nextText = fullPhrase.slice(0, currentText.length - 1);
      setCurrentText(nextText);

      if (nextText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [currentText, isDeleting, isPaused, currentPhraseIndex, phrases, pauseDuration]);

  useEffect(() => {
    if (isPaused) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);

    return () => clearTimeout(timer);
  }, [tick, isDeleting, isPaused, typingSpeed, deletingSpeed]);

  return (
    <span
      className="font-mono text-2xl md:text-3xl"
      style={{ color: "var(--accent)" }}
      aria-label={phrases[currentPhraseIndex]}
      role="status"
      aria-live="polite"
    >
      {currentText}
      <span
        className="inline-block w-[2px] h-[1em] ml-1 align-middle"
        style={{
          backgroundColor: "var(--accent)",
          animation: "blink 1s step-end infinite",
        }}
        aria-hidden="true"
      />
    </span>
  );
}
