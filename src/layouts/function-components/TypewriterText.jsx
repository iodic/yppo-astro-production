import { useState, useEffect } from "react";

const TypewriterText = ({ text, delay, infinite = false, className = "" }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
    } else if (infinite) {
      setCurrentIndex(0);
      setCurrentText("");
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, text]);

  return (
    currentText && (
      <span className={className && className}>
        {[...currentText].map((letter, index) => (
          <span
            className={`letter-${index} ${index === 0 || currentText[index - 1] === " " ? "accent-letter" : ""}`}
            key={index}
          >
            {letter}
          </span>
        ))}
      </span>
    )
  );
};

export default TypewriterText;
