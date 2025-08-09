import { useEffect } from 'react';

const useGestures = (ref, options = {}) => {
  const { onSwipe, onLongPress, onPinch, onMultiTouch } = options;

  useEffect(() => {
    const el = ref && 'current' in ref ? ref.current : ref;
    if (!el) return undefined;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let longPressTimer = null;
    let isLongPress = false;
    let startTarget = null;
    let edgeSwipe = false;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const isEdgeSwipe = touch.clientX < 50 || touch.clientX > window.innerWidth - 50;
      if (!isEdgeSwipe) return;
      edgeSwipe = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      startTarget = e.target;
      isLongPress = false;

      if (onLongPress) {
        longPressTimer = setTimeout(() => {
          isLongPress = true;
          onLongPress(e);
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }, options.longPressDelay || 500);
      }

      if (e.touches.length > 1 && onMultiTouch) {
        onMultiTouch(e);
      }
    };

    const handleTouchMove = (e) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = Math.abs(touch.clientY - startY);
      if (deltaX > 10 || deltaY > 10) {
        isLongPress = false;
      }
    };

    const handleTouchEnd = (e) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }

      if (isLongPress || !edgeSwipe) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const threshold = options.swipeThreshold || 50;
      const timeThreshold = options.swipeTimeLimit || 300;

      if (dt < timeThreshold && absDx > absDy && absDx > threshold && onSwipe) {
        const direction = dx > 0 ? 'right' : 'left';
        onSwipe(direction, e, startTarget);
        if (navigator.vibrate) {
          navigator.vibrate(25);
        }
      }
      edgeSwipe = false;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onSwipe, onLongPress, onPinch, onMultiTouch, options.longPressDelay, options.swipeThreshold, options.swipeTimeLimit]);
};

export default useGestures;

