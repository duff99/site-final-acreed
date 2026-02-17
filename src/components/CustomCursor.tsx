import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CLICKABLE_SELECTOR = 'a, button, [role="button"], input, textarea, select';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(CLICKABLE_SELECTOR)) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(CLICKABLE_SELECTOR)) {
      setIsHovering(false);
    }
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, handleMouseOver, handleMouseOut]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          scale: isHovering ? 1.3 : 1,
          rotate: isHovering ? -8 : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ filter: isHovering ? 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' : 'none' }}
      >
        {/* Historical arrow cursor - calligraphic style, tip at top-left */}
        <path
          d="M4 2 L4 24 L9 19 L13.5 27 L16.5 25.5 L12 17.5 L18 17 Z"
          fill="white"
          stroke="black"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Decorative serif/flourish on the shaft */}
        <path
          d="M5.5 18 Q3 20 4.5 22"
          fill="none"
          stroke="white"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
};

export default CustomCursor;
