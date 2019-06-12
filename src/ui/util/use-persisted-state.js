import { useEffect, useState } from 'react';

export function usePersistedState(key, firstTimeDefault) {
  let defaultValue;
  if (key) {
    defaultValue = localStorage.getItem(key);
  }
  if (!defaultValue) {
    defaultValue = firstTimeDefault;
  }

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (key) {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
}
