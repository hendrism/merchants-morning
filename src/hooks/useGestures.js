import { useEffect } from 'react';

// Basic multi-gesture recognition hook
const useGestures = (ref, options = {}) => {
  const { onSwipe, onLongPress, onPinch, onMultiTouch } = options;

  useEffect(() => {
    const el = ref && 'current' in ref ? ref.current : ref;
    if (!el) return undefined;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let longPressTimer = null;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      if (onLongPress) {
        longPressTimer = setTimeout(() => onLongPress(e), options.longPressDelay || 500);
      }
      if (e.touches.length > 1 && onMultiTouch) {
        onMultiTouch(e);
      }
    };

    const handleTouchMove = () => {
      if (longPressTimer) clearTimeout(longPressTimer);
    };

    const handleTouchEnd = (e) => {
      if (longPressTimer) clearTimeout(longPressTimer);
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const threshold = options.swipeThreshold || 30;
      if (dt < 500 && Math.max(absDx, absDy) > threshold && onSwipe) {
        const direction = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        onSwipe(direction, e);
      }
    };

    const handleGesture = (e) => {
      if (e.touches.length === 2 && onPinch) {
        onPinch(e);
      }
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('gesturechange', handleGesture);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('gesturechange', handleGesture);
    };
  }, [ref, onSwipe, onLongPress, onPinch, onMultiTouch, options.longPressDelay, options.swipeThreshold]);
};

export default useGestures;
