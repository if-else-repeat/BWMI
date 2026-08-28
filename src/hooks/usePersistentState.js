import { useState, useEffect } from "react";

export default function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Error reading sessionStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn("Error setting sessionStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}
