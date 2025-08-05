import { useCallback } from 'react';

const useGamePersistence = (key) => {
  const loadState = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return null;
    }
  }, [key]);

  const saveState = useCallback(
    (state) => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.error(`Failed to save ${key}`, e);
      }
    },
    [key]
  );

  const clearState = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to clear ${key}`, e);
    }
  }, [key]);

  return { loadState, saveState, clearState };
};

export default useGamePersistence;

