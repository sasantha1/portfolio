import { useEffect, useState } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function DecoderText({ text, start, className }) {
  const [display, setDisplay] = useState(start ? text : '');
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!start || reduceMotion) {
      setDisplay(text);
      return undefined;
    }
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / 28);
      const out = text
        .split('')
        .map((c, i) => {
          if (c === ' ') return ' ';
          if (i < text.length * progress) return text[i];
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join('');
      setDisplay(out);
      if (progress >= 1) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [text, start, reduceMotion]);

  return <span className={className}>{display}</span>;
}
