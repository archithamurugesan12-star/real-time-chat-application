import { useRef, useEffect } from 'react';

export function useScrollToBottom(dependencies = [], smooth = true) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = (behavior = smooth ? 'smooth' : 'auto') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return { containerRef, bottomRef, scrollToBottom };
}

export default useScrollToBottom;
