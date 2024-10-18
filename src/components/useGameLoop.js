import { useRef, useEffect } from 'react';

export const useGameLoop = (canvasRef, update, draw, setGameTime, fixedTimeStep) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const lagRef = useRef(0);

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const elapsedTime = time - previousTimeRef.current;
      lagRef.current += elapsedTime;

      while (lagRef.current >= fixedTimeStep) {
        update(fixedTimeStep);
        lagRef.current -= fixedTimeStep;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      draw(ctx);

      setGameTime(time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update, draw]);
};