// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// src/hooks/useFormProgress.js
import { useState, useEffect } from 'react';

export const useFormProgress = (formData, totalSteps = 3) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const filledFields = Object.values(formData).filter(
      value => value && value.toString().trim().length > 0
    ).length;
    
    const totalFields = Object.keys(formData).length;
    const currentProgress = (filledFields / totalFields) * 100;
    
    setProgress(Math.min(currentProgress, 100));
    setIsComplete(currentProgress >= 80); // 80% threshold
  }, [formData]);

  return { progress, isComplete };
};