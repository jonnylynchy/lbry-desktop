import { useEffect, useState } from 'react';

export default function usePersistedState(key, firstTimeDefault) {
  const defaultValue = localStorage.getItem(key) || firstTimeDefault;
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
