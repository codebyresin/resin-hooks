import { useState, useCallback } from 'react';

export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, setValue, toggle] as const;
}
