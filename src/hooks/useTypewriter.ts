import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  startDelay?: number;
}

export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {}
): { displayed: string; done: boolean } {
  const { speed = 38, startDelay = 600 } = options;
  const [displayed, setDisplayed] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout | null = null;
    setDisplayed('');
    setDone(false);

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (timer) clearInterval(timer);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
